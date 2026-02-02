export const shakeGame = (dom, { ms = 180 } = {}) => {
  const { containerEl } = dom;
  if (!containerEl) return;

  containerEl.classList.remove("shake");
  // restart animacji
  void containerEl.offsetWidth;
  containerEl.classList.add("shake");

  setTimeout(() => {
    containerEl.classList.remove("shake");
  }, ms);
};
