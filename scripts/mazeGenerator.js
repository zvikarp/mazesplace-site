function generateWordMaze() {
  const generateButton = document.getElementById("generate-maze");
  const generatingText = document.getElementById("generating-maze");
  const mazeText = document.getElementById("word-maze-input").value.toString();
  const url = "https://mazesplace-server.herokuapp.com/";
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
