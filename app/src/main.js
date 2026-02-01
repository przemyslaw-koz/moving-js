import { getDom } from "./dom.js";
import { createInitialState, GAME_STATES } from "./state.js";
import { renderHUD } from "./ui/hud.js";
import { showOverlay } from "./ui/overlay.js";
import { bindHudButtons } from "./ui/buttons.js";
import { keyToAction } from "./systems/input.js";
import { createGameLoop } from "./loop/gameLoop.js";
import { createTick } from "./loop/tick.js";
import { playCoinSound } from "./audio/sfx.js";

import { createContext } from "./game/context.js";
import { createGameActions } from "./game/actions.js";
import { createHero } from "./entities/hero.js";
import { createEnemy } from "./entities/enemy.js";

const dom = getDom();
const state = createInitialState();
const step = 10;

const ENEMY_SPRITE = {
  frameSize: 48,
  framesPerRow: 4,
  tickModulo: 3,
};

const enemy = createEnemy();
const hero = createHero();
const ctx = createContext({
  dom,
  state,
  hero,
  enemy,
  enemySprite: ENEMY_SPRITE,
  step,
});

let actions;

const tick = createTick({
  dom,
  state,
  hero,
  enemy,
  getSafeTop: ctx.getSafeTop,
  enemySprite: ENEMY_SPRITE,
  onGameOver: () => actions.gameOver(),
  onTreasureCollect: () => playCoinSound(),
});

const gameLoop = createGameLoop({
  tickMs: 50,
  shouldTick: () => state.gameState === GAME_STATES.PLAYING,
  onTick: tick,
});

actions = createGameActions({ ctx, gameLoop });

bindHudButtons(dom, {
  onRestart: () => actions.restart(),
  onToggleMute: () => actions.handleAction({ type: "TOGGLE_MUTE" }),
});

renderHUD(state, dom);
showOverlay(dom, "Pixel Przygoda", "Wciśnij Enter, aby zacząć.");

document.addEventListener("keydown", (event) => {
  const action = keyToAction(event.key, step);
  if (!action) return;

  actions.handleAction(action);
});
