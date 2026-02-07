export const placeEnemyRandom = (enemy, dom, getSafeTop) => {
  const { enemyEl, containerEl } = dom;
  if (!enemyEl || !containerEl) return;

  const playW = containerEl.clientWidth;
  const playH = containerEl.clientHeight;

  const safeTop = getSafeTop();
  const w = enemyEl.offsetWidth || 48;
  const h = enemyEl.offsetHeight || 48;

  const maxX = Math.max(0, playW - w);
  const maxY = Math.max(0, playH - h);

  enemy.x = Math.floor(Math.random() * maxX);
  enemy.y = Math.floor(safeTop + Math.random() * Math.max(1, maxY - safeTop));

  enemyEl.style.left = `${enemy.x}px`;
  enemyEl.style.top = `${enemy.y}px`;
  enemyEl.classList.remove("invisible");
};

export const moveEnemyTick = ({ dom, enemy, hero, getSafeTop, onAnimate }) => {
  const { enemyEl, containerEl } = dom;
  if (!enemyEl || !containerEl) return;

  const playW = containerEl.clientWidth;
  const playH = containerEl.clientHeight;
  const safeTop = getSafeTop();
  const w = enemyEl.offsetWidth || 48;
  const h = enemyEl.offsetHeight || 48;

  const dx = hero.xPosition - enemy.x;
  const dy = hero.yPosition - enemy.y;
  const len = Math.hypot(dx, dy) || 1;

  enemy.x += (dx / len) * enemy.speed;
  enemy.y += (dy / len) * enemy.speed;

  enemy.x = Math.max(0, Math.min(enemy.x, playW - w));
  enemy.y = Math.max(safeTop, Math.min(enemy.y, playH - h));

  enemyEl.style.left = `${enemy.x}px`;
  enemyEl.style.top = `${enemy.y}px`;

  onAnimate?.();
};
