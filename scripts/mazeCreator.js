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
  return 500;
}

function getBoardSize() {
  const boardSizeSelector = document.getElementById("maze-creator-board-size");
  const size =
      boardSizeSelector.options[boardSizeSelector.selectedIndex].value.split(
          "x");
  return [ parseInt(size[0]), parseInt(size[1]) ];
}

function canvasToArray(canvas, flip) {
  boardSize = getBoardSize();

  const array = Array(boardSize[1]).fill().map(() => Array(boardSize[0]));

  scale = canvas.width / boardSize[0];
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
  createButton.style.display = "none";
  creatingText.style.display = "inline";
  const array = canvasToArray(canvas, mazeType.selectedIndex == 1);
  const flag = mazeType.selectedIndex > 1 ? 1 : 0;

  const url = "https://mazesplace-server.herokuapp.com/create";
  // const url = "http://127.0.0.1:5000/create";
  const params = {
    headers : {
      Accept : "application/json",
      "Content-Type" : "application/json",
    },
    body : JSON.stringify({flag, array}),
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