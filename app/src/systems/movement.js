export const measureMoveBounds = ({ containerEl, heroEl, safeTop = 0 }) => {
  if (!containerEl || !heroEl) {
    return {
      width: 0,
      height: 0,
      heroWidth: 0,
      heroHeight: 0,
      safeTop: 0,
    };
  }

  const heroRect = heroEl.getBoundingClientRect();

  const playWidth = containerEl.clientWidth;
  const playHeight = containerEl.clientHeight;

  return {
    width: playWidth,
    height: playHeight,
    heroWidth: heroRect.width,
    heroHeight: heroRect.height,
    safeTop: Math.max(0, safeTop),
  };
};

export const tryMoveHero = ({ hero, bounds, dx = 0, dy = 0 }) => {
  if (!hero || !bounds) return false;

  const { width, height, heroWidth = 0, heroHeight = 0, safeTop = 0 } = bounds;

  if (
    typeof width !== "number" ||
    typeof height !== "number" ||
    typeof hero.xPosition !== "number" ||
    typeof hero.yPosition !== "number"
  ) {
    return false;
  }

  const nextX = hero.xPosition + dx;
  const nextY = hero.yPosition + dy;

  const minX = 0;
  const minY = Math.max(0, safeTop);
  const maxX = Math.max(0, width - heroWidth);
  const maxY = Math.max(0, height - heroHeight);

  const clampedX = Math.max(minX, Math.min(nextX, maxX));
  const clampedY = Math.max(minY, Math.min(nextY, maxY));

  const moved = clampedX !== hero.xPosition || clampedY !== hero.yPosition;

  hero.xPosition = clampedX;
  hero.yPosition = clampedY;

  return moved;
};
