export const applyDifficulty = (
  state,
  enemy,
  { baseSpeed = 3, stepEvery = 5, speedInc = 0.5, maxSpeed = 7 } = {},
) => {
  if (!state || !enemy) return;

  const score = Number(state.score || 0);
  const levels = Math.floor(score / stepEvery);
  const nextSpeed = Math.min(maxSpeed, baseSpeed + levels * speedInc);

  enemy.speed = nextSpeed;
};
