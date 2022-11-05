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

    drawRoom("#ebebeb", 0.3, 1, 0, 30);
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
