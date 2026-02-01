export const placeEnemyRandom = (enemy, dom, getSafeTop) => {
  const { enemyEl, containerEl } = dom;
  if (!enemyEl) return;

  const containerRect = containerEl.getBoundingClientRect();
  const safeTop = getSafeTop();
  const w = enemyEl.offsetWidth || 48;
  const h = enemyEl.offsetHeight || 48;

  const maxX = Math.max(0, containerRect.width - w);
  const maxY = Math.max(0, containerRect.height - h);

  enemy.x = Math.floor(Math.random() * maxX);
  enemy.y = Math.floor(safeTop + Math.random() * Math.max(1, maxY - safeTop));

  enemyEl.style.left = `${enemy.x}px`;
  enemyEl.style.top = `${enemy.y}px`;
  enemyEl.classList.remove("invisible");
};

export const moveEnemyTick = ({ dom, enemy, hero, getSafeTop, onAnimate }) => {
  const { enemyEl, containerEl } = dom;
  if (!enemyEl || !containerEl) return;

  const containerRect = containerEl.getBoundingClientRect();
  const safeTop = getSafeTop();
  const w = enemyEl.offsetWidth || 48;
  const h = enemyEl.offsetHeight || 48;

  //follow hero
  const dx = hero.xPosition - enemy.x;
  const dy = hero.yPosition - enemy.y;
  const len = Math.hypot(dx, dy) || 1;

  enemy.x += (dx / len) * enemy.speed;
  enemy.y += (dy / len) * enemy.speed;

  // clamp
  enemy.x = Math.max(0, Math.min(enemy.x, containerRect.width - w));
  enemy.y = Math.max(safeTop, Math.min(enemy.y, containerRect.height - h));

  enemyEl.style.left = `${enemy.x}px`;
  enemyEl.style.top = `${enemy.y}px`;

  onAnimate?.();
};
