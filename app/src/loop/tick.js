import { moveEnemyTick } from "../systems/enemyAI.js";
import { handleEnemyCollision, renderEnemySprite } from "../entities/enemy.js";
import { renderHUD } from "../ui/hud.js";
import { checkTreasureCollision } from "../entities/treasure.js";

export const createTick = ({
  dom,
  state,
  hero,
  enemy,
  getSafeTop,
  enemySprite,
  onGameOver,
  onTreasureCollect,
}) => {
  const { squareEl, enemyEl, flashEl } = dom;

  const flashHitFx = () => {
    renderHUD(state, dom);

    squareEl.classList.add("hurt");
    setTimeout(() => squareEl.classList.remove("hurt"), 1000);

    if (flashEl) {
      flashEl.classList.add("on");
      setTimeout(() => flashEl.classList.remove("on"), 90);
    }
  };

  return () => {
    moveEnemyTick({
      dom,
      enemy,
      hero,
      getSafeTop,
      onAnimate: () => renderEnemySprite(enemyEl, enemy, 1, enemySprite),
    });

    handleEnemyCollision({
      state,
      dom,
      heroEl: squareEl,
      onHit: flashHitFx,
      onDeath: onGameOver,
    });

    checkTreasureCollision(state, dom, getSafeTop, {
      onCollect: () => {
        renderHUD(state, dom);
        onTreasureCollect?.();
      },
    });
  };
};
