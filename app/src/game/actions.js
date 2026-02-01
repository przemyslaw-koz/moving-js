import { GAME_STATES, resetState } from "../state.js";
import { renderHUD } from "../ui/hud.js";
import { showOverlay, hideOverlay } from "../ui/overlay.js";

import { showTreasure, checkTreasureCollision } from "../entities/treasure.js";
import { initEnemy, renderEnemySprite } from "../entities/enemy.js";
import { placeEnemyRandom } from "../systems/enemyAI.js";
import { tryMoveHero, measureMoveBounds } from "../systems/movement.js";

import { playStartSound, playCoinSound } from "../audio/sfx.js";
import { startBgm, stopBgm, toggleMute, changeVolume } from "../audio/bgm.js";

import { INPUT_ACTIONS } from "../systems/input.js";
import {
  renderHeroSprite,
  renderHeroPosition,
  stepHeroAnimation,
} from "../entities/hero.js";

export const createGameActions = ({ ctx, gameLoop }) => {
  const { dom, state, hero, enemy, enemySprite, getSafeTop } = ctx;
  const { treasureEl, enemyEl, squareEl, containerEl, bgmEl } = dom;

  const heroSpriteCache = { baseDir: "", lastBg: "" };

  const handleMove = (action) => {
    if (state.gameState !== GAME_STATES.PLAYING) return;

    stepHeroAnimation(hero, action.dir);
    renderHeroSprite(squareEl, hero, heroSpriteCache);

    const bounds = measureMoveBounds({
      containerEl,
      heroEl: squareEl,
    });

    const moved = tryMoveHero({
      hero,
      dx: action.dx,
      dy: action.dy,
      bounds,
    });

    if (moved) renderHeroPosition(squareEl, hero);

    // collisions treasure (na razie zostaje tu; później przeniesiemy do ticka)
    checkTreasureCollision(state, dom, getSafeTop, {
      onCollect: () => {
        renderHUD(state, dom);
        playCoinSound();
      },
    });
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
        toggleMute(bgmEl);
        return true;
      case INPUT_ACTIONS.VOLUME_UP:
        changeVolume(bgmEl, 0.05);
        return true;
      case INPUT_ACTIONS.VOLUME_DOWN:
        changeVolume(bgmEl, -0.05);
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
    startBgm(bgmEl);
    playStartSound();
    renderHUD(state, dom);

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
    stopBgm(bgmEl);
    gameLoop.stop();

    if (enemyEl) enemyEl.classList.add("invisible");
    showOverlay(dom, "GAME OVER", `Wynik: ${state.score}. Enter = restart`);
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
      default:
        return;
    }
  };

  return { restart, gameOver, handleAction };
};
