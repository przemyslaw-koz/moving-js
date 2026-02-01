export const showOverlay = (dom, title, text) => {
  if (overlayTitleEl) dom.overlayTitleEl.textContent = title;
  if (overlayTextEl) dom.overlayTextEl.textContent = text;
  if (overlayEl) dom.overlayEl.classList.remove("hidden");
};

export const hideOverlay = (dom) => {
  if (overlayEl) dom.overlayEl.classList.add("hidden");
};
