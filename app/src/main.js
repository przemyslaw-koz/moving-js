import { getDom } from "./dom.js";
import { createInitialState, GAME_STATES, resetState } from "./state.js";
import { renderHUD } from "./ui/hud.js";
import { showOverlay } from "./ui/overlay.js";
import { bindHudButtons } from "./ui/buttons.js";

const dom = getDom();
const {
  flashEl,
  treasureEl,
  enemyEl,
  hudEl,
  containerEl,
  squareEl,
  startBtn,
  bgmEl,
  restartBtn,
  muteBtn,
} = dom;
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

// ---- AUDIO ----
let audioCtx = null;

function ensureAudio() {
  if (!audioCtx)
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
}

function playTone({
  type = "square",
  freq = 440,
  duration = 0.12,
  gain = 0.1,
  at = 0,
}) {
  ensureAudio();

  const now = audioCtx.currentTime + at;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(gain, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(g);
  g.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.02);
}

function playStartSound() {
  // mini fanfara: trzy szybkie nuty w górę
  playTone({
    type: "triangle",
    freq: 523.25,
    duration: 0.1,
    gain: 0.12,
    at: 0.0,
  }); // C5
  playTone({
    type: "triangle",
    freq: 659.25,
    duration: 0.1,
    gain: 0.12,
    at: 0.11,
  }); // E5
  playTone({
    type: "triangle",
    freq: 783.99,
    duration: 0.14,
    gain: 0.12,
    at: 0.22,
  }); // G5
}

function playCoinSound() {
  // klasyczny "coin": szybki skok w górę + drugi mały ding
  playTone({ type: "square", freq: 880, duration: 0.1, gain: 0.12, at: 0.0 }); // A5
  playTone({ type: "square", freq: 1320, duration: 0.08, gain: 0.1, at: 0.06 }); // E6
  playTone({
    type: "triangle",
    freq: 660,
    duration: 0.12,
    gain: 0.08,
    at: 0.1,
  }); // E5
}

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

function getSafeTop() {
  // obszar pod HUD, gdzie nie spawnujemy skarbów/potworów
  if (!hudEl) return 0;
  // hud jest wewnątrz kontenera i ma top:10px
  return hudEl.offsetTop + hudEl.offsetHeight + 10;
}

function placeEnemyRandom() {
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
}

function startEnemyLoop() {
  if (enemyTimer) clearInterval(enemyTimer);
  enemyTimer = setInterval(() => {
    if (state.gameState !== GAME_STATES.PLAYING) return;
    moveEnemyTick();
    checkEnemyCollision();
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

function moveEnemyTick() {
  if (!enemyEl) return;
  const containerRect = containerEl.getBoundingClientRect();
  const w = enemyEl.offsetWidth || 48;
  const h = enemyEl.offsetHeight || 48;
  const safeTop = getSafeTop();

  // kierunek do gracza (hero.xPosition / hero.yPosition)
  const dx = hero.xPosition - enemy.x;
  const dy = hero.yPosition - enemy.y;
  const len = Math.hypot(dx, dy) || 1;

  enemy.x += (dx / len) * enemy.speed;
  enemy.y += (dy / len) * enemy.speed;

  // clamp do planszy + safeTop
  enemy.x = Math.max(0, Math.min(enemy.x, containerRect.width - w));
  enemy.y = Math.max(safeTop, Math.min(enemy.y, containerRect.height - h));

  enemyEl.style.left = `${enemy.x}px`;
  enemyEl.style.top = `${enemy.y}px`;

  // w trakcie gonienia: wiersz 1 (walk)
  updateEnemySprite(1);
}

function restartGame() {
  resetState(state);

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
  showTreasure();

  // enemy
  placeEnemyRandom();
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
  let newX = hero.xPosition;
  let newY = hero.yPosition;
  const containerRect = containerEl.getBoundingClientRect();
  const squareRect = squareEl.getBoundingClientRect();

  const moveHero = animateMovement(hero);
  switch (event.key) {
    case "ArrowLeft":
      newX -= step;
      const newHero1 = moveHero("l");
      hero.step = newHero1.step;
      hero.direction = newHero1.direction;
      bgImg = changeImage(hero)(bgImg);
      break;
    case "ArrowRight":
      newX += step;
      const newHero = moveHero("r");
      hero.step = newHero.step;
      hero.direction = newHero.direction;
      bgImg = changeImage(hero)(bgImg);
      break;
    case "ArrowDown":
      newY += step;
      const newHero2 = moveHero("d");
      hero.step = newHero2.step;
      hero.direction = newHero2.direction;
      bgImg = changeImage(hero)(bgImg);
      break;
    case "ArrowUp":
      newY -= step;
      const newHero3 = moveHero("u");
      hero.step = newHero3.step;
      hero.direction = newHero3.direction;
      bgImg = changeImage(hero)(bgImg);
      break;
    case "Enter":
      if (
        state.gameState === GAME_STATES.MENU ||
        state.gameState === GAME_STATES.GAMEOVER
      ) {
        restartGame();
      }
      break;
    case "m":
    case "M":
      if (bgmEl) bgmEl.muted = !bgmEl.muted;
      break;
    case "+":
      if (bgmEl) bgmEl.volume = Math.min(1, bgmEl.volume + 0.05);
      break;
    case "-":
      if (bgmEl) bgmEl.volume = Math.max(0, bgmEl.volume - 0.05);
      break;
  }

  if (state.gameState !== GAME_STATES.PLAYING) return;

  if (
    newX >= 0 &&
    newX <= containerRect.width - squareRect.width &&
    newY >= 0 &&
    newY <= containerRect.height - squareRect.height
  ) {
    hero.xPosition = newX;
    hero.yPosition = newY;
    squareEl.style.left = hero.xPosition + "px";
    squareEl.style.top = hero.yPosition + "px";
  }

  checkTreasureCollision();
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

const showTreasure = () => {
  console.log("pokazał się skarb!");

  const containerRect = containerEl.getBoundingClientRect();
  const size = 32;
  const safeTop = getSafeTop();

  const maxX = containerRect.width - size;
  const maxY = containerRect.height - size;

  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(safeTop + Math.random() * Math.max(1, maxY - safeTop));

  const img = pickRandom(treasureImages);
  treasureEl.style.backgroundImage = `url("${img}")`;
  treasureEl.style.left = `${x}px`;
  treasureEl.style.top = `${y}px`;
  treasureEl.classList.remove("hidden");
  state.treasureCollecting = false;
};

const isTreasureColliding = (a, b) => {
  const r1 = a.getBoundingClientRect();
  const r2 = b.getBoundingClientRect();

  return !(
    r1.right < r2.left ||
    r1.left > r2.right ||
    r1.bottom < r2.top ||
    r1.top > r2.bottom
  );
};

const checkTreasureCollision = () => {
  if (state.gameState !== GAME_STATES.PLAYING) return;
  if (treasureEl.classList.contains("hidden")) return;
  if (state.treasureCollecting) return;

  if (isTreasureColliding(squareEl, treasureEl)) {
    state.treasureCollecting = true;
    state.score += 1;
    renderHUD(state, dom);

    playCoinSound();

    // błysk
    flashEl.classList.add("on");
    setTimeout(() => flashEl.classList.remove("on"), 70);

    treasureEl.classList.remove("pop");
    void treasureEl.offsetWidth; // reflow
    treasureEl.classList.add("pop");

    // po animacji: schowaj i pokaż nowy
    setTimeout(() => {
      treasureEl.classList.remove("pop");
      treasureEl.classList.add("hidden");
      showTreasure();
    }, 180);

    console.log("kolizja ze skarbem");
  }
};

const treasureImages = [
  "/img/gem1.png",
  "/img/gem2.png",
  "/img/gem3.png",
  "/img/gem4.png",
  "/img/gem5.png",
  "/img/gem6.png",
  "/img/gem7.png",
];

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

function checkEnemyCollision() {
  if (state.gameState !== GAME_STATES.PLAYING) return;
  if (!enemyEl || enemyEl.classList.contains("invisible")) return;

  // i-frames po otrzymaniu hita
  if (Date.now() < state.invincibleUntil) return;

  if (isTreasureColliding(squareEl, enemyEl)) {
    state.lives -= 1;
    renderHUD(state, dom);

    // efekt: krótka nietykalność i mruganie
    state.invincibleUntil = Date.now() + 1000;
    squareEl.classList.add("hurt");
    setTimeout(() => squareEl.classList.remove("hurt"), 1000);

    // enemy "hurt" (wiersz 2) na moment
    updateEnemySprite(2);
    setTimeout(() => {
      // wróć do "walk" jeśli gra nadal trwa
      if (state.gameState === GAME_STATES.PLAYING) {
        updateEnemySprite(1);
      }
    }, 250);

    // błysk (ten sam co skarb)
    flashEl.classList.add("on");
    setTimeout(() => flashEl.classList.remove("on"), 90);

    if (state.lives <= 0) {
      gameOver();
    }
  }
}
