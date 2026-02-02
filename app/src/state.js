export const GAME_STATES = {
  MENU: "menu",
  PLAYING: "playing",
  PAUSED: "paused",
  GAMEOVER: "gameover",
};

export const createInitialState = () => {
  return {
    gameState: GAME_STATES.MENU,
    score: 0,
    treasureCollecting: false,
    lives: 3,
    invincibleUntil: 0, //for enemy collision
  };
};

export const resetState = (state) => {
  const freshState = createInitialState();
  Object.assign(state, freshState);
  return state;
};
