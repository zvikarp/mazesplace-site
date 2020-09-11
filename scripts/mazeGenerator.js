function generateWordMaze() {
  const generateButton = document.getElementById("generate-maze");
  const generatingText = document.getElementById("generating-maze");
  const mazeText =
      document.getElementById("maze-generator-input").value.toString();
  // const url = "https://mazesplace-server.herokuapp.com/";
  const url = "http://127.0.0.1:5000/generate";
  const data = {text : mazeText};
  const params = {
    headers : {
      Accept : "application/json",
      "Content-Type" : "application/json",
    },
    body : JSON.stringify(data),
    method : "POST",
  };

  generateButton.style.display = "none";
  generatingText.style.display = "inline";

  fetch(url, params)
      .then(function(response) { return response.blob(); })
      .then(function(avatarAsBlob) {
        const objectURL = URL.createObjectURL(avatarAsBlob);
        generatingText.download = "generated-maze.JPEG";
        generatingText.href = objectURL;
        generatingText.click();
      })
      .catch((err) => { console.log(err); })
      .finally((e) => {
        generateButton.style.display = "inline";
        generatingText.style.display = "none";
      });
}

function createMaze() {
  var canvas = document.querySelector("#mainCanvas");
  const generateButton = document.getElementById("generate-maze");
  const generatingText = document.getElementById("generating-maze");
  let array = Array(100).fill().map(() => Array(100));

  for (var x = 0; x < 100; x++) {
    for (var y = 0; y < 100; y++) {
      var pixelData =
          canvas.getContext("2d").getImageData(y * 5, x * 5, 1, 1).data;
      array[x][y] = pixelData[3] == 255;
    }
  }

  const url = "http://127.0.0.1:5000/create";
  const data = {array};
  const params = {
    headers : {
      Accept : "application/json",
      "Content-Type" : "application/json",
    },
    body : JSON.stringify(data),
    method : "POST",
  };

  fetch(url, params)
      .then(function(response) { return response.blob(); })
      .then(function(avatarAsBlob) {
        const objectURL = URL.createObjectURL(avatarAsBlob);
        generatingText.download = "generated-maze.JPEG";
        generatingText.href = objectURL;
        generatingText.click();
      })
      .catch((err) => { console.log(err); })
      .finally((e) => {
        generateButton.style.display = "inline";
        generatingText.style.display = "none";
      });
  console.log(array);
}
