export const GAME_STATES = {
  MENU: "menu",
  PLAYING: "playing",
  GAMEOVER: "gameover",
};

export const createInitialState = () => {
  return {
    gameState: GAME_STATES.MENU,
    score: 0,
    treasureCollecting: false,
    lives: 3,
    invincibleUntil:0, //for enemy collision
  };
};
