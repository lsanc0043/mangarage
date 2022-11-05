import { useLayoutEffect } from "react";
// sketch package
import rough from "roughjs/bundled/rough.esm";
const gen = rough.generator();

const Home = () => {
  // allows canvas to draw as the page is uploading
  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    // eslint-disable-next-line
    const ctx = canvas.getContext("2d");

    const rc = rough.canvas(canvas);
    // left, top, right, bottom
    const drawLine = (x1, y1, x2, y2, color, width, rough) => {
      rc.draw(
        gen.line(x1, y1, x2, y2, {
          stroke: color,
          strokeWidth: width,
          roughness: rough,
        })
      );
    };

    const drawRoom = (color, width, rough, xChange, yChange) => {
      drawLine(0, 0, window.innerWidth, 0, color, width, rough); // upper edge 1
      drawLine(0, 40, window.innerWidth, 40, color, width, rough); // upper edge 2
      drawLine(500, 40, 500, 330 + yChange, color, width, 2); // vertical wall
      drawLine(510 + xChange, 600 + yChange, 775, 600 + yChange, color, width, 2); // horizontal wall
      drawLine(800 + xChange, 600 + yChange, window.innerWidth, 600 + yChange, color, width, 2); // horizontal wall
      drawLine(485 + xChange, 600 + yChange, 232, 770, color, width, 2); // diagonal wall 1
      drawLine(485 + xChange, 600 + yChange, 232, 770, color, width, 2); // diagonal wall 1
    };

    const drawDesk = (color, width, rough, xChange, yChange) => {
      drawLine(500 + xChange, 330 + yChange, 200 + xChange, 480 + yChange, color, width, rough); // left diagonal
      drawLine(800 + xChange, 330 + yChange, 500 + xChange, 480 + yChange, color, width, rough); // right diagonal
      drawLine(800 + xChange, 350 + yChange, 500 + xChange, 500 + yChange, color, width, rough); // right diagonal - edge
      drawLine(800 + xChange, 330 + yChange, 500 + xChange, 330 + yChange, color, width, rough); // top horizontal
      drawLine(500 + xChange, 480 + yChange, 200 + xChange, 480 + yChange, color, width, rough); // bottom horizontal
      drawLine(500 + xChange, 500 + yChange, 200 + xChange, 500 + yChange, color, width, rough); // bottom horizontal - edge
      drawLine(200 + xChange, 480 + yChange, 200 + xChange, 500 + yChange, color, width, rough); // bottom left vertical - edge
      drawLine(500 + xChange, 480 + yChange, 500 + xChange, 500 + yChange, color, width, rough); // bottom right vertical - edge
      drawLine(800 + xChange, 330 + yChange, 800 + xChange, 350 + yChange, color, width, rough); // top right vertical - edge
  
      drawLine(800 + xChange, 350 + yChange, 800 + xChange, 605 + yChange, color, 0.3, 1); // top right leg - outward edge 575-320 = 255
      drawLine(790 + xChange, 360 + yChange, 790 + xChange, 615 + yChange, color, 0.3, 1); // top right leg - middle edge
      drawLine(775 + xChange, 360 + yChange, 775 + xChange, 615 + yChange, color, 0.3, 1); // top right leg - inward edge 615-360 = 255
      drawLine(775 + xChange, 615 + yChange, 790 + xChange, 615 + yChange, color, 0.3, 1); // top right leg - bottom horizontal edge
      drawLine(800 + xChange, 605 + yChange, 790 + xChange, 615 + yChange, color, 0.3, 1); // top right leg - bottom horizontal edge
  
      drawLine(510 + xChange, 490 + yChange, 510 + xChange, 770 + yChange, color, 0.3, 1); // bottom right leg - outward edge
      drawLine(500 + xChange, 500 + yChange, 500 + xChange, 780 + yChange, color, 0.3, 1); // bottom right leg - middle edge
      drawLine(485 + xChange, 500 + yChange, 485 + xChange, 780 + yChange, color, 0.3, 1); // bottom right leg - inward edge
      drawLine(485 + xChange, 780 + yChange, 500 + xChange, 780 + yChange, color, 0.3, 1); // top right leg - bottom horizontal edge
      drawLine(500 + xChange, 780 + yChange, 510 + xChange, 770 + yChange, color, 0.3, 1); // top right leg - bottom horizontal edge
  
      drawLine(200 + xChange, 500 + yChange, 200 + xChange, 780 + yChange, color, 0.3, 1); // bottom left leg - outward edge
      drawLine(215 + xChange, 500 + yChange, 215 + xChange, 780 + yChange, color, 0.3, 1); // bottom left leg - middle edge
      drawLine(225 + xChange, 500 + yChange, 225 + xChange, 770 + yChange, color, 0.3, 1); // bottom left leg - inward edge
      drawLine(200 + xChange, 780 + yChange, 215 + xChange, 780 + yChange, color, 0.3, 1); // top right leg - bottom horizontal edge
      drawLine(215 + xChange, 780 + yChange, 225 + xChange, 770 + yChange, color, 0.3, 1); // top right leg - bottom horizontal edge
    };

    drawRoom("#ebebeb", 0.3, 1, 0, 30);
    drawDesk("#ebebeb", 0.5, 2.5, 0, 30);
  });

  return (
    <>
      <canvas id="canvas" width={window.innerWidth} height={window.innerWidth} style={{position: "fixed", top: "125px"}}>
        Canvas
      </canvas>
    </>
  );
};

export default Home;
