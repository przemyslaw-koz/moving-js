import { playCoinSound, playHit, playStartSound } from "./sfx.js";
import { startBgm, stopBgm, toggleMute, changeVolume } from "./bgm.js";

export const createAudio = (dom) => {
  const { bgmEl } = dom;

  return {
    // BGM
    startBgm: () => startBgm(bgmEl),
    stopBgm: () => stopBgm(bgmEl),
    toggleMute: () => toggleMute(bgmEl),
    changeVolume: (delta) => changeVolume(bgmEl, delta),

    // SFX
    playStart: () => playStartSound(),
    playCoin: () => playCoinSound(),
    playHit: () => playHit(),
  };
};
