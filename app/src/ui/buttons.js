export const bindHudButtons = (dom, { onRestart, onToggleMute }) => {
  if (dom.restartBtn) dom.restartBtn.addEventListener("click", onRestart);

  if (dom.muteBtn) {
    dom.muteBtn.addEventListener("click", onToggleMute);
  }
};
