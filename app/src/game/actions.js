import { GAME_STATES, resetState } from "../state.js";
import { renderHUD } from "../ui/hud.js";
import { showOverlay, hideOverlay } from "../ui/overlay.js";

import { showTreasure } from "../entities/treasure.js";
import { initEnemy, renderEnemySprite } from "../entities/enemy.js";
import { placeEnemyRandom } from "../systems/enemyAI.js";
import { tryMoveHero, measureMoveBounds } from "../systems/movement.js";

import { INPUT_ACTIONS } from "../systems/input.js";
import {
  renderHeroSprite,
  renderHeroPosition,
  stepHeroAnimation,
} from "../entities/hero.js";
import { toggleMute } from "../audio/bgm.js";

export const createGameActions = ({ ctx, gameLoop }) => {
  const { dom, state, hero, enemy, enemySprite, getSafeTop, audio } = ctx;
  const { treasureEl, enemyEl, squareEl, containerEl } = dom;

  const heroSpriteCache = { baseDir: "", lastBg: "" };

  const handleMove = (action) => {
    if (state.gameState !== GAME_STATES.PLAYING) return;

    stepHeroAnimation(hero, action.dir);
    renderHeroSprite(squareEl, hero, heroSpriteCache);

    const bounds = measureMoveBounds({
      containerEl,
      heroEl: squareEl,
      safeTop: getSafeTop(),
    });

    const moved = tryMoveHero({
      hero,
      dx: action.dx,
      dy: action.dy,
      bounds,
    });

    if (moved) renderHeroPosition(squareEl, hero);
  };

  const handleStart = () => {
    if (
      state.gameState === GAME_STATES.MENU ||
      state.gameState === GAME_STATES.GAMEOVER
    ) {
      restart();
    }
  };

  const handleAudio = (action) => {
    switch (action.type) {
      case INPUT_ACTIONS.TOGGLE_MUTE:
        audio.toggleMute();
        return true;
      case INPUT_ACTIONS.VOLUME_UP:
        audio.changeVolume(0.05);
        return true;
      case INPUT_ACTIONS.VOLUME_DOWN:
        audio.changeVolume(-0.05);
        return true;
      default:
        return false;
    }
  };

  // --- core actions
  const restart = () => {
    resetState(state);
    state.gameState = GAME_STATES.PLAYING;

    squareEl.classList.remove("hurt");
    initEnemy(enemy);

    hideOverlay(dom);
    audio.startBgm();
    audio.playStart();
    renderHUD(state, dom);

    hero.yPosition = Math.max(hero.yPosition, getSafeTop());
    renderHeroPosition(squareEl, hero);

    treasureEl.classList.add("hidden");
    showTreasure(state, dom, getSafeTop);

    placeEnemyRandom(enemy, dom, getSafeTop);
    if (enemyEl) {
      enemyEl.classList.remove("invisible");
      renderEnemySprite(enemyEl, enemy, 0, enemySprite);
    }

    gameLoop.start();
  };

  const gameOver = () => {
    state.gameState = GAME_STATES.GAMEOVER;
    state.treasureCollecting = true;
    audio.stopBgm();
    gameLoop.stop();

    if (enemyEl) enemyEl.classList.add("invisible");
    showOverlay(dom, "GAME OVER", `Wynik: ${state.score}. Enter = restart`);
  };

  const togglePause = () => {
    if (state.gameState === GAME_STATES.PLAYING) {
      state.gameState = GAME_STATES.PAUSED;
      showOverlay(dom, "PAUSED", "Spacja / P = wznów");
      return;
    }

    if (state.gameState === GAME_STATES.PAUSED) {
      state.gameState = GAME_STATES.PLAYING;
      hideOverlay(dom);
    }
  };

  const handleAction = (action) => {
    if (handleAudio(action)) return;

    switch (action.type) {
      case INPUT_ACTIONS.START:
        handleStart();
        return;
      case INPUT_ACTIONS.MOVE:
        handleMove(action);
        return;
      case INPUT_ACTIONS.PAUSE:
        togglePause();
        return;
      default:
        return;
    }
  };

  return { restart, gameOver, handleAction, togglePause };
};
