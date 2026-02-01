import { isOverlapping } from "../utils/rect.js";

export const hasCollision = (aEl, bEl) => {
  if (!aEl || !bEl) return false;
  return isOverlapping(aEl, bEl);
};