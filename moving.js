const square = document.getElementById("square");

let xPosition = 100;
let yPosition = 100;

const step = 10;

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      xPosition -= step;
      break;
    case "ArrowRight":
      xPosition += step;
      break;
    case "ArrowDown":
      yPosition += step;
      break;
    case "ArrowUp":
      yPosition -= step;
      break;
  }

  square.style.left = xPosition + "px";
  square.style.top = yPosition + "px";
});
