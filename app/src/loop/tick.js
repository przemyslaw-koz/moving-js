import { moveEnemyTick } from "../systems/enemyAI.js";
import { handleEnemyCollision, renderEnemySprite } from "../entities/enemy.js";
import { renderHUD } from "../ui/hud.js";
import { checkTreasureCollision } from "../entities/treasure.js";
import { measureMoveBounds } from "../systems/movement.js";
import { applyKnockback } from "../systems/knockback.js";

export const createTick = ({
  dom,
  state,
  hero,
  enemy,
  getSafeTop,
  enemySprite,
  onGameOver,
  onTreasureCollect,
  onEnemyHit,
}) => {
  const { squareEl, enemyEl, flashEl, containerEl } = dom;

  const flashHitFx = () => {
    onEnemyHit?.();
    renderHUD(state, dom);

    squareEl.classList.add("hurt");
    setTimeout(() => squareEl.classList.remove("hurt"), 1000);

    if (flashEl) {
      flashEl.classList.add("on");
      setTimeout(() => flashEl.classList.remove("on"), 90);
    }

    if (containerEl && squareEl) {
      const bounds = measureMoveBounds({ containerEl, heroEl: squareEl });
      applyKnockback({
        hero,
        enemy,
        bounds,
        safeTop: getSafeTop(),
        distance: 100,//TODO: check live and decide how much is needed
      });
      squareEl.style.left = `${hero.xPosition}px`;
      squareEl.style.top = `${hero.yPosition}px`;
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
