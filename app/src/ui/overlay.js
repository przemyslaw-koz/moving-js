export const showOverlay = (dom, title, text) => {
  if (dom.overlayTitleEl) dom.overlayTitleEl.textContent = title;
  if (dom.overlayTextEl) dom.overlayTextEl.textContent = text;
  if (dom.overlayEl) dom.overlayEl.classList.remove("hidden");
};

export const hideOverlay = (dom) => {
  if (dom.overlayEl) dom.overlayEl.classList.add("hidden");
};
