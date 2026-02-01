export const isOverlapping = (aEl, bEl) => {
  if (!aEl || !bEl) return false;

  const r1 = aEl.getBoundingClientRect();
  const r2 = bEl.getBoundingClientRect();

  return !(
    r1.right < r2.left ||
    r1.left > r2.right ||
    r1.bottom < r2.top ||
    r1.top > r2.bottom
  );
};
