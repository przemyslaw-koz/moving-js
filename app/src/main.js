import { getDom } from "./dom.js";
import { createInitialState, GAME_STATES, resetState } from "./state.js";
import { renderHUD } from "./ui/hud.js";
import { showOverlay, hideOverlay } from "./ui/overlay.js";
import { bindHudButtons } from "./ui/buttons.js";
import { playStartSound, playCoinSound } from "./audio/sfx.js";
import { showTreasure, checkTreasureCollision } from "./entities/treasure.js";
import { handleEnemyCollision } from "./entities/enemy.js";
import { moveEnemyTick, placeEnemyRandom } from "./systems/enemyAI.js";

const dom = getDom();
const { flashEl, treasureEl, enemyEl, hudEl, containerEl, squareEl, bgmEl } =
  dom;
const state = createInitialState();
const step = 10;

// Enemy state
let enemyTimer = null;

const enemy = {
  x: 300,
  y: 200,
  speed: 3, // px per tick (50ms) ~ 60px/s
  frame: 0, // 0..3
  row: 0, // 0..2 (wiersz w spritesheet)
  tick: 0, // do animacji (spowolnienie klatek)
};

const ENEMY_FRAME_SIZE = 48; // px (taki jak #enemy width/height)
const ENEMY_FRAMES_PER_ROW = 4;

// ---- UI / STATE ----
function startBgm() {
  if (!bgmEl) return;
  bgmEl.volume = 0.35;
  bgmEl.play().catch(() => {});
}

function stopBgm() {
  if (!bgmEl) return;
  bgmEl.pause();
  bgmEl.currentTime = 0;
}

const getSafeTop = () => {
  // obszar pod HUD, gdzie nie spawnujemy skarbów/potworów
  if (!hudEl) return 0;
  // hud jest wewnątrz kontenera i ma top:10px
  return hudEl.offsetTop + hudEl.offsetHeight + 10;
};

function startEnemyLoop() {
  if (enemyTimer) clearInterval(enemyTimer);

  enemyTimer = setInterval(() => {
    if (state.gameState !== GAME_STATES.PLAYING) return;

    moveEnemyTick({
      dom,
      enemy,
      hero,
      getSafeTop,
      onAnimate: () => updateEnemySprite(1),
    });

    handleEnemyCollision({
      state,
      dom,
      heroEl: squareEl,
      onHit: () => {
        renderHUD(state, dom);

        squareEl.classList.add("hurt");
        setTimeout(() => squareEl.classList.remove("hurt"), 1000);

        if (flashEl) {
          flashEl.classList.add("on");
          setTimeout(() => flashEl.classList.remove("on"), 90);
        }
      },
      onDeath: () => gameOver(),
    });
  }, 50);
}

function stopEnemyLoop() {
  if (enemyTimer) clearInterval(enemyTimer);
  enemyTimer = null;
  if (enemyEl) enemyEl.classList.add("invisible");
}

function updateEnemySprite(row) {
  if (!enemyEl) return;
  enemy.row = row;

  // animacja co kilka ticków, żeby nie "mieliło" za szybko
  enemy.tick += 1;
  if (enemy.tick % 3 === 0) {
    // zmień 3 -> 2 (szybciej) lub 4 (wolniej)
    enemy.frame = (enemy.frame + 1) % ENEMY_FRAMES_PER_ROW;
  }

  const x = -(enemy.frame * ENEMY_FRAME_SIZE);
  const y = -(enemy.row * ENEMY_FRAME_SIZE);
  enemyEl.style.backgroundPosition = `${x}px ${y}px`;
}

function restartGame() {
  resetState(state);
  state.gameState = GAME_STATES.PLAYING;

  squareEl.classList.remove("hurt");

  enemy.frame = 0;
  enemy.row = 0;
  enemy.tick = 0;

  // UI + audio
  hideOverlay(dom);
  startBgm();
  playStartSound();
  renderHUD(state, dom);

  // treasure
  treasureEl.classList.add("hidden");
  showTreasure(state, dom, getSafeTop);

  // enemy
  placeEnemyRandom(enemy, dom, getSafeTop);
  // start: pokaż enemy + anim + wiersz "idle"
  if (enemyEl) {
    enemyEl.classList.remove("invisible");

    // nie używamy już klas anim/rowX — jedziemy po backgroundPosition w px
    enemyEl.style.backgroundPosition = `0px 0px`;
    enemyEl.style.outline = ""; // jeśli miałeś debug outline, usuń
  }
  startEnemyLoop();
}

function gameOver() {
  state.gameState = GAME_STATES.GAMEOVER;
  state.treasureCollecting = true;
  stopBgm();
  stopEnemyLoop();
  showOverlay(dom, "GAME OVER", `Wynik: ${state.score}. Enter = restart`);
}

const hero = {
  xPosition: 100,
  yPosition: 100,
  step: 1,
  direction: "r",
};

let bgImg = window.getComputedStyle(squareEl).backgroundImage;

const changeImage = (hero) => (currentBackgroundImage) => {
  const imageUrl = currentBackgroundImage.substring(
    5,
    currentBackgroundImage.length - 2,
  );

  const parts = imageUrl.split("/");
  const directory = parts.slice(0, -1).join("/");

  const newImageName = `knight${hero.step}-${hero.direction}.png`;

  const newImageUrl = `${directory}/${newImageName}`;

  const newBgImg = `url("${newImageUrl}")`;

  squareEl.style.backgroundImage = newBgImg;
  return newBgImg;
};

// HUD buttons
bindHudButtons(dom, {
  onRestart: () => restartGame(),
  onToggleMute: () => {
    if (dom.bgmEl) dom.bgmEl.muted = !dom.bgmEl.muted;
  },
});

// Initial screen
renderHUD(state, dom);
showOverlay(dom, "Rycerz i Skarby", "Wciśnij Enter, aby zacząć.");

document.addEventListener("keydown", (event) => {
  const action = keyToAction(event.key, step);
  if (!action) return;

  switch (action.type) {
    case INPUT_ACTIONS.TOGGLE_MUTE:
      if (bgmEl) bgmEl.muted = !bgmEl.muted;
      return;

    case INPUT_ACTIONS.VOLUME_UP:
      if (bgmEl) bgmEl.volume = Math.min(1, bgmEl.volume + 0.05);
      return;

    case INPUT_ACTIONS.VOLUME_DOWN:
      if (bgmEl) bgmEl.volume = Math.max(0, bgmEl.volume - 0.05);
      return;

    case INPUT_ACTIONS.START:
      if (
        state.gameState === GAME_STATES.MENU ||
        state.gameState === GAME_STATES.GAMEOVER
      ) {
        restartGame();
      }
      return;

    case INPUT_ACTIONS.MOVE: {
      if (state.gameState !== GAME_STATES.PLAYING) return;

      // 1) animacja / kierunek (to jeszcze zostaje tutaj – mały commit)
      const moveHero = animateMovement(hero);
      const next = moveHero(action.dir);
      hero.step = next.step;
      hero.direction = next.direction;
      bgImg = changeImage(hero)(bgImg);

      // 2) movement + bounds (to też jeszcze tu – identycznie jak było)
      const containerRect = containerEl.getBoundingClientRect();
      const squareRect = squareEl.getBoundingClientRect();

      const newX = hero.xPosition + action.dx;
      const newY = hero.yPosition + action.dy;

      if (
        newX >= 0 &&
        newX <= containerRect.width - squareRect.width &&
        newY >= 0 &&
        newY <= containerRect.height - squareRect.height
      ) {
        hero.xPosition = newX;
        hero.yPosition = newY;
        squareEl.style.left = newX + "px";
        squareEl.style.top = newY + "px";
      }

      // 3) po ruchu
      checkTreasureCollision(state, dom, getSafeTop, {
        onCollect: () => {
          renderHUD(state, dom);
          playCoinSound();
        },
      });

      return;
    }
  }
});

const animateMovement = (hero) => (direction) => {
  const newHero = { ...hero };

  if (direction == "u" || direction == "d") {
    if (newHero.step == 7) {
      newHero.step = 1;
    } else {
      newHero.step += 1;
    }
  } else if (direction == newHero.direction) {
    if (newHero.step == 7) {
      newHero.step = 1;
    } else {
      newHero.step += 1;
    }
  } else {
    newHero.step = 1;
    newHero.direction = direction;
  }

  return newHero;
};
