// app/src/entities/enemy.js
import { GAME_STATES } from "../state.js";
import { hasCollision } from "../systems/collisions.js";

export const initEnemy = (enemy) => {
  enemy.frame = 0;
  enemy.row = 0;
  enemy.tick = 0;
};

export const createEnemy = () => ({
  x: 300,
  y: 200,
  speed: 3,
  frame: 0,
  row: 0,
  tick: 0,
});

export const renderEnemySprite = (
  enemyEl,
  enemy,
  row,
  { frameSize = 48, framesPerRow = 4, tickModulo = 3 } = {},
) => {
  if (!enemyEl) return;

  enemy.row = row;

  enemy.tick += 1;
  if (enemy.tick % tickModulo === 0) {
    enemy.frame = (enemy.frame + 1) % framesPerRow;
  }

  const x = -(enemy.frame * frameSize);
  const y = -(enemy.row * frameSize);
  enemyEl.style.backgroundPosition = `${x}px ${y}px`;
};

export const handleEnemyCollision = ({
  state,
  dom,
  heroEl,
  now = Date.now(),
  onHit,
  onDeath,
}) => {
  const { enemyEl } = dom;

  if (state.gameState !== GAME_STATES.PLAYING) return false;
  if (!enemyEl || !heroEl) return false;
  if (enemyEl.classList.contains("invisible")) return false;
  if (now < state.invincibleUntil) return false;

  if (!hasCollision(heroEl, enemyEl)) return false;

  state.lives -= 1;
  state.invincibleUntil = now + 1000;

  onHit?.(state);

  if (state.lives <= 0) {
    onDeath?.(state);
  }

  return true;
};
