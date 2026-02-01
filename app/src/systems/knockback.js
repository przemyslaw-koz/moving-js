export const applyKnockback = ({
  hero,
  enemy,
  bounds,
  safeTop = 0,
  distance = 32,
}) => {
  const dx = hero.xPosition - enemy.x;
  const dy = hero.yPosition - enemy.y;
  const len = Math.hypot(dx, dy) || 1;

  const nx = dx / len;
  const ny = dy / len;

  hero.xPosition += nx * distance;
  hero.yPosition += ny * distance;

  // clamp
  const maxX = Math.max(0, bounds.width - bounds.heroWidth);
  const maxY = Math.max(safeTop, bounds.height - bounds.heroHeight);

  hero.xPosition = Math.max(0, Math.min(hero.xPosition, maxX));
  hero.yPosition = Math.max(safeTop, Math.min(hero.yPosition, maxY));
};
