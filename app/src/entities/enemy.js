// entities/enemy.js
import { GAME_STATES } from "../state.js";
import { hasCollision } from "../systems/collisions.js";

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
