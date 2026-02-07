import { pickRandom } from "../utils/random.js";
import { isOverlapping } from "../utils/rect.js";
import { GAME_STATES } from "../state.js";

const TREASURE_IMAGES = [
  "/img/gem1.png",
  "/img/gem2.png",
  "/img/gem3.png",
  "/img/gem4.png",
  "/img/gem5.png",
  "/img/gem6.png",
  "/img/gem7.png",
];

export const showTreasure = (state, dom, getSafeTop) => {
  const { containerEl, treasureEl } = dom;
  if (!containerEl || !treasureEl) return;

  const playW = containerEl.clientWidth;
  const playH = containerEl.clientHeight;
  const size = 32;
  const safeTop = getSafeTop();

  const maxX = playW - size;
  const maxY = playH - size;

  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(safeTop + Math.random() * Math.max(1, maxY - safeTop));

  const img = pickRandom(TREASURE_IMAGES);
  treasureEl.style.backgroundImage = `url("${img}")`;
  treasureEl.style.left = `${x}px`;
  treasureEl.style.top = `${y}px`;
  treasureEl.classList.remove("hidden");
  state.treasureCollecting = false;
};

export const checkTreasureCollision = (
  state,
  dom,
  getSafeTop,
  { onCollect } = {},
) => {
  const { squareEl, treasureEl, flashEl } = dom;
  if (!squareEl || !treasureEl) return false;

  if (state.gameState !== GAME_STATES.PLAYING) return false;
  if (treasureEl.classList.contains("hidden")) return false;
  if (state.treasureCollecting) return false;

  if (!isOverlapping(squareEl, treasureEl)) return false;

  state.treasureCollecting = true;
  state.score += 1;

  onCollect?.();

  if (flashEl) {
    flashEl.classList.add("on");
    setTimeout(() => flashEl.classList.remove("on"), 70);
  }

  treasureEl.classList.remove("pop");
  void treasureEl.offsetWidth;
  treasureEl.classList.add("pop");

  setTimeout(() => {
    treasureEl.classList.remove("pop");
    treasureEl.classList.add("hidden");
    showTreasure(state, dom, getSafeTop);
  }, 180);

  return true;
};
