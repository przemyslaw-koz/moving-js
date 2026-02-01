export const measureMoveBounds = ({ containerEl, heroEl }) => {
  if (!containerEl || !heroEl) {
    return {
      width: 0,
      height: 0,
      heroWidth: 0,
      heroHeight: 0,
    };
  }

  const containerRect = containerEl.getBoundingClientRect();
  const heroRect = heroEl.getBoundingClientRect();

  return {
    width: containerRect.width,
    height: containerRect.height,
    heroWidth: heroRect.width,
    heroHeight: heroRect.height,
  };
};

export const tryMoveHero = ({ hero, bounds, dx = 0, dy = 0 }) => {
  if (!hero || !bounds) return false;

  const { width, height, heroWidth = 0, heroHeight = 0 } = bounds;

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
  const minY = 0;
  const maxX = Math.max(0, width - heroWidth);
  const maxY = Math.max(0, height - heroHeight);

  const clampedX = Math.max(minX, Math.min(nextX, maxX));
  const clampedY = Math.max(minY, Math.min(nextY, maxY));

  const moved = clampedX !== hero.xPosition || clampedY !== hero.yPosition;

  hero.xPosition = clampedX;
  hero.yPosition = clampedY;

  return moved;
};
