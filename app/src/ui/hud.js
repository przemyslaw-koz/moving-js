export const renderHUD = (state, dom) => {
  if (dom.livesEl)
    dom.livesEl.textContent = "❤️".repeat(Math.max(0, state.lives));
  if (dom.scoreEl) dom.scoreEl.textContent = state.score;
};
