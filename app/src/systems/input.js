export const INPUT_ACTIONS = {
  MOVE: "move",
  START: "start",
  TOGGLE_MUTE: "toggle_mute",
  VOLUME_UP: "volume_up",
  VOLUME_DOWN: "volume_down",
  PAUSE: "pause",
};

export const keyToAction = (key, step = 10) => {
  switch (key) {
    case "ArrowLeft":
      return { type: INPUT_ACTIONS.MOVE, dx: -step, dy: 0, dir: "l" };
    case "ArrowRight":
      return { type: INPUT_ACTIONS.MOVE, dx: step, dy: 0, dir: "r" };
    case "ArrowUp":
      return { type: INPUT_ACTIONS.MOVE, dx: 0, dy: -step, dir: "u" };
    case "ArrowDown":
      return { type: INPUT_ACTIONS.MOVE, dx: 0, dy: step, dir: "d" };

    case "Enter":
      return { type: INPUT_ACTIONS.START };

    case "m":
    case "M":
      return { type: INPUT_ACTIONS.TOGGLE_MUTE };

    case "+":
      return { type: INPUT_ACTIONS.VOLUME_UP };

    case "-":
      return { type: INPUT_ACTIONS.VOLUME_DOWN };

    case "P":
    case "p":
    case " ":
      return { type: INPUT_ACTIONS.PAUSE };

    default:
      return null;
  }
};
