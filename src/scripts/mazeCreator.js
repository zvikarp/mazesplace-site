function clearCreateMazeCanvas() {
  const canvas = document.getElementById("maze-creator-canvas");
  const size = getCanvasSize();
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, size, size);
}

function getCanvasSize() {
  const screenWidth = window.innerWidth;
  if (screenWidth < 450)
    return screenWidth - 50;
  else if (screenWidth < 1000)
    return 500;
  return 700;
}

function getBoardSize() {
  const boardSizeSelector = document.getElementById("maze-creator-board-size");
  const size =
      boardSizeSelector.options[boardSizeSelector.selectedIndex].value.split(
          "x");
  return [ parseInt(size[0]), parseInt(size[1]) ];
}

function getScale(boardSize, canvas) { return canvas.width / boardSize[0]; }

function getPoint(pnt, scale) {
  return [
    Math.floor((parseInt(pnt.style.top.slice(0, -2)) + pnt.clientWidth / 2) /
               scale),
    Math.floor((parseInt(pnt.style.left.slice(0, -2)) + pnt.clientHeight / 2) /
               scale),
  ];
}

function canvasToArray(canvas, boardSize, scale, flip) {
  const array = Array(boardSize[1]).fill().map(() => Array(boardSize[0]));

  for (let x = 0; x < boardSize[1]; x++) {
    for (let y = 0; y < boardSize[0]; y++) {
      const pixelData =
          canvas.getContext("2d").getImageData(y * scale, x * scale, 1, 1).data;
      array[x][y] = pixelData[3] == 255;
      if (flip) {
        array[x][y] = !array[x][y];
      }
    }
  }

  return array;
}

function createMaze() {
  const canvas = document.querySelector("#maze-creator-canvas");
  const mazeType = document.getElementById("maze-creator-type");
  const createButton = document.getElementById("create-maze");
  const creatingText = document.getElementById("creating-maze");
  const startPoint = document.getElementById("maze-creator-start");
  const endPoint = document.getElementById("maze-creator-end");

  const boardSize = getBoardSize();
  const scale = getScale(boardSize, canvas);
  const strPnt = getPoint(startPoint, scale);
  const endPnt = getPoint(endPoint, scale);
  const array =
      canvasToArray(canvas, boardSize, scale, mazeType.selectedIndex == 1);
  const flag = mazeType.selectedIndex > 1 ? 1 : 0;

  createButton.style.display = "none";
  creatingText.style.display = "inline";

  const url = `${config.server}create`;
  const params = {
    headers : {
      Accept : "text/plain",
      "Content-Type" : "text/plain",
    },
    body : JSON.stringify({array, flag, points : [ strPnt, endPnt ]}),
    method : "POST",
  };

  fetch(url, params)
      .then(function(response) { return response.blob(); })
      .then(function(avatarAsBlob) {
        const objectURL = URL.createObjectURL(avatarAsBlob);
        creatingText.download = "custom-maze.JPEG";
        creatingText.href = objectURL;
        creatingText.click();
        logEvent("create_maze", "maze_creator", "maze_creator");
      })
      .catch((err) => { console.log(err); })
      .finally((e) => {
        createButton.style.display = "inline";
        creatingText.style.display = "none";
      });
}
