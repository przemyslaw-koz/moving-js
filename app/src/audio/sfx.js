import { playTone } from "./audio.js";

export const playStartSound = () => {
  playTone({
    type: "triangle",
    freq: 523.25,
    duration: 0.1,
    gain: 0.12,
    at: 0.0,
  });
  playTone({
    type: "triangle",
    freq: 659.25,
    duration: 0.1,
    gain: 0.12,
    at: 0.11,
  });
  playTone({
    type: "triangle",
    freq: 783.99,
    duration: 0.14,
    gain: 0.12,
    at: 0.22,
  });
};

export const playCoinSound = () => {
  playTone({ type: "square", freq: 880, duration: 0.1, gain: 0.12, at: 0.0 }); // A5
  playTone({ type: "square", freq: 1320, duration: 0.08, gain: 0.1, at: 0.06 }); // E6
  playTone({
    type: "triangle",
    freq: 660,
    duration: 0.12,
    gain: 0.08,
    at: 0.1,
  });
};

export const playHit = () => {
  playTone({ type: "square", freq: 180, duration: 0.08, gain: 0.12 });
  playTone({ type: "square", freq: 120, duration: 0.1, gain: 0.1, at: 0.06 });
};
