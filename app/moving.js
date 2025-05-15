const container = document.getElementById("container");
const square = document.getElementById("square");
const startButton = document.getElementById("start-button");
const step = 10;

const hero = {
  xPosition: 100,
  yPosition: 100,
  step: 1,
  direction: "r",
};

let bgImg = window.getComputedStyle(square).backgroundImage;
let isButtonActive = false;

const changeImage = (hero) => (currentBackgroundImage) => {
  const imageUrl = currentBackgroundImage.substring(
    5,
    currentBackgroundImage.length - 2
  );

  const parts = imageUrl.split("/");
  const directory = parts.slice(0, -1).join("/");

  const newImageName = `knight${hero.step}-${hero.direction}.png`;

  const newImageUrl = `${directory}/${newImageName}`;

  const newBgImg = `url("${newImageUrl}")`;

  square.style.backgroundImage = newBgImg;
  return newBgImg;
};

const checkIfOnButton = () => {
  const squareRect = square.getBoundingClientRect();
  const buttonRect = startButton.getBoundingClientRect();

  return !(
    squareRect.right < buttonRect.left ||
    squareRect.left > buttonRect.right ||
    squareRect.bottom < buttonRect.top ||
    squareRect.top > buttonRect.bottom
  );
};

document.addEventListener("keydown", (event) => {
  let newX = hero.xPosition;
  let newY = hero.yPosition;
  const containerRect = container.getBoundingClientRect();
  const squareRect = square.getBoundingClientRect();

  const moveHero = animateMovement(hero);
  switch (event.key) {
    case "ArrowLeft":
      newX -= step;
      const newHero1 = moveHero("l");
      hero.step = newHero1.step;
      hero.direction = newHero1.direction;
      bgImg = changeImage(hero)(bgImg);
      break;
    case "ArrowRight":
      newX += step;
      const newHero = moveHero("r");
      hero.step = newHero.step;
      hero.direction = newHero.direction;
      bgImg = changeImage(hero)(bgImg);
      break;
    case "ArrowDown":
      newY += step;
      const newHero2 = moveHero("d");
      hero.step = newHero2.step;
      hero.direction = newHero2.direction;
      bgImg = changeImage(hero)(bgImg);
      break;
    case "ArrowUp":
      newY -= step;
      const newHero3 = moveHero("u");
      hero.step = newHero3.step;
      hero.direction = newHero3.direction;
      bgImg = changeImage(hero)(bgImg);
      break;
    case "Enter":
      if (isButtonActive) {
        startButton.classList.add("pressed");
        console.log("Przycisk Start został naciśnięty!");
        setTimeout(() => {
          startButton.classList.remove("pressed");
        }, 200);
      }
      break;
  }

  if (
    newX >= 0 &&
    newX <= containerRect.width - squareRect.width &&
    newY >= 0 &&
    newY <= containerRect.height - squareRect.height
  ) {
    hero.xPosition = newX;
    hero.yPosition = newY;
    square.style.left = hero.xPosition + "px";
    square.style.top = hero.yPosition + "px";
  }

  const onButton = checkIfOnButton();
  if (onButton && !isButtonActive) {
    startButton.classList.add("active");
    isButtonActive = true;
    console.log("Kwadrat na przycisku Start.");
  } else if (!onButton && isButtonActive) {
    startButton.classList.remove("active");
    isButtonActive = false;
  }
});

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
