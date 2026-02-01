export const createGameLoop = ({
  tickMs = 50,
  shouldTick = () => true,
  onTick,
}) => {
  let timer = null;

  const start = () => {
    if (timer) clearInterval(timer);

    timer = setInterval(() => {
      if (!shouldTick()) return;
      onTick?.();
    }, tickMs);
  };

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  const isRunning = () => timer !== null;

  return { start, stop, isRunning };
};
