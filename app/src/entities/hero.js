export const createHero = ({
  xPosition = 100,
  yPosition = 100,
  step = 1,
  direction = "r",
} = {}) => ({ xPosition, yPosition, step, direction });

export const stepHeroAnimation = (hero, dir) => {
  // bazujemy na Twojej obecnej logice
  if (dir === "u" || dir === "d") {
    hero.step = hero.step === 7 ? 1 : hero.step + 1;
    return;
  }

  if (dir === hero.direction) {
    hero.step = hero.step === 7 ? 1 : hero.step + 1;
    return;
  }

  hero.step = 1;
  hero.direction = dir;
};

const getAssetDirFromBg = (currentBg) => {
  // currentBg: url(".../knight1-r.png") lub url(...).
  // bezpiecznie: wyciągamy ścieżkę bazową (folder).
  const raw = currentBg.startsWith('url("')
    ? currentBg.slice(5, -2)
    : currentBg.startsWith("url(")
      ? currentBg.slice(4, -1)
      : "";

  const parts = raw.split("/");
  return parts.slice(0, -1).join("/");
};

export const renderHeroSprite = (heroEl, hero, cache) => {
  if (!heroEl) return;

  // cache trzyma: { baseDir, lastBg }
  if (!cache.baseDir) {
    const currentBg = window.getComputedStyle(heroEl).backgroundImage;
    cache.baseDir = getAssetDirFromBg(currentBg);
  }

  const newImageName = `knight${hero.step}-${hero.direction}.png`;
  const newBg = `url("${cache.baseDir}/${newImageName}")`;

  // minimalny micro-opt: nie ustawiaj style jeśli nie trzeba
  if (cache.lastBg !== newBg) {
    heroEl.style.backgroundImage = newBg;
    cache.lastBg = newBg;
  }
};

export const renderHeroPosition = (heroEl, hero) => {
  if (!heroEl) return;
  heroEl.style.left = `${hero.xPosition}px`;
  heroEl.style.top = `${hero.yPosition}px`;
};
