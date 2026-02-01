export const startBgm = (bgmEl, { volume = 0.35 } = {}) => {
  if (!bgmEl) return false;
  bgmEl.volume = volume;
  bgmEl.play().catch(() => {});
  return true;
};

export const stopBgm = (bgmEl) => {
  if (!bgmEl) return false;
  bgmEl.pause();
  bgmEl.currentTime = 0;
  return true;
};

export const toggleMute = (bgmEl) => {
  if (!bgmEl) return false;
  bgmEl.muted = !bgmEl.muted;
  return true;
};

export const changeVolume = (bgmEl, delta) => {
  if (!bgmEl) return false;
  bgmEl.volume = Math.max(0, Math.min(1, bgmEl.volume + delta));
  return true;
};
