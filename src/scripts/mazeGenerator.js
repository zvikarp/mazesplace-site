function generateWordMaze() {
	const generateButton = document.getElementById("generate-maze");
	const generatingText = document.getElementById("generating-maze");
	const mazeText = document
		.getElementById("maze-generator-input")
		.value.toString();

	const url = `${config.server}generate`;
	const data = { text: mazeText };
	const params = {
		headers: {
			Accept: "text/plain",
			"Content-Type": "text/plain",
		},
		body: JSON.stringify(data),
		method: "POST",
	};

	generateButton.style.display = "none";
	generatingText.style.display = "inline";

	fetch(url, params)
		.then(function (response) {
			return response.blob();
		})
		.then(function (avatarAsBlob) {
			const objectURL = URL.createObjectURL(avatarAsBlob);
			generatingText.download = "generated-maze.JPEG";
			generatingText.href = objectURL;
			generatingText.click();
			logEvent("create_maze", "maze_generator", "maze_generator");
		})
		.catch((err) => {
			console.log(err);
		})
		.finally((e) => {
			generateButton.style.display = "inline";
			generatingText.style.display = "none";
		});
}
