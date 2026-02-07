export const getDom = () => {
  const dom = {
    flashEl: document.getElementById("flash"),
    treasureEl: document.getElementById("treasure"),
    scoreEl: document.getElementById("score"),
    livesEl: document.getElementById("lives"),
    enemyEl: document.getElementById("enemy"),
    hudEl: document.getElementById("hud"),
    containerEl: document.getElementById("container"),
    squareEl: document.getElementById("square"),
    startBtnn: document.getElementById("start-button"),
    bgmEl: document.getElementById("bgm"),
    overlayEl: document.getElementById("overlay"),
    overlayTitleEl: document.getElementById("overlay-title"),
    overlayTextEl: document.getElementById("overlay-text"),
    restartBtn: document.getElementById("restart-btn"),
    muteBtn: document.getElementById("mute-btn"),
  };

  return dom;
};
