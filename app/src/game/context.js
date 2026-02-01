export const createContext = ({ dom, state, hero, enemy, enemySprite, step }) => {
  const { hudEl } = dom;

  const getSafeTop = () => {
    if (!hudEl) return 0;
    return hudEl.offsetTop + hudEl.offsetHeight + 10;
  };

  return {
    dom,
    state,
    hero,
    enemy,
    enemySprite,
    step,
    getSafeTop,
  };
};
