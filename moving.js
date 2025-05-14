const square = document.getElementById("square");
const step = 10;

const hero = {
  xPosition: 100,
  yPosition: 100,
  step: 1,
  direction: "r",
};

let bgImg = window.getComputedStyle(square).backgroundImage;

const changeImage = (hero) => (currentBackgroundImage) => {
  const imageUrl = currentBackgroundImage.substring(
    5,
    currentBackgroundImage.length - 2
  );

  const parts = imageUrl.split("/");
  const directory = parts.slice(0, -1).join("/"); // Ścieżka do folderu

  const newImageName = `knight${hero.step}-${hero.direction}.png`;

  const newImageUrl = `${directory}/${newImageName}`;

  const newBgImg = `url("${newImageUrl}")`;

  square.style.backgroundImage = newBgImg;
  return newBgImg;
};

document.addEventListener("keydown", (event) => {
  const moveHero = animateMovement(hero);
  switch (event.key) {
    case "ArrowLeft":
      hero.xPosition -= step;
      const newHero1 = moveHero("l");
      hero.step = newHero1.step;
      hero.direction = newHero1.direction;
      bgImg = changeImage(hero)(bgImg);
      break;
    case "ArrowRight":
      hero.xPosition += step;
      const newHero = moveHero("r");
      hero.step = newHero.step;
      hero.direction = newHero.direction;
      bgImg = changeImage(hero)(bgImg);
      break;
    case "ArrowDown":
      hero.yPosition += step;
      const newHero2 = moveHero("d");
      hero.step = newHero2.step;
      hero.direction = newHero2.direction;
      bgImg = changeImage(hero)(bgImg);
      break;
    case "ArrowUp":
      hero.yPosition -= step;
      const newHero3 = moveHero("u");
      hero.step = newHero3.step;
      hero.direction = newHero3.direction;
      bgImg = changeImage(hero)(bgImg);
      break;
  }

  square.style.left = hero.xPosition + "px";
  square.style.top = hero.yPosition + "px";
});

const move = (hero) => (direction) => {
  hero;
};

const animateMovement = (hero) => (direction) => {
  const newHero = { ...hero };

  if (direction == "u" || direction == "d") {
    if (newHero.step == 7) {
      newHero.step = 1;
    } else {
      newHero.step += 1;
    }
  } else if (direction == newHero.direction) {
    if (newHero.step == 7) {
      newHero.step = 1;
    } else {
      newHero.step += 1;
    }
  } else {
    newHero.step = 1;
    newHero.direction = direction;
  }

  return newHero;
};
