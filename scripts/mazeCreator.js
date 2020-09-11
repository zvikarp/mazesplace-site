// // Clear the canvas when button is clicked
// function clear_canvas_width() {
// 	const s = document.getElementById("maze-creator-canvas");
// 	const w = s.width;
// 	s.width = 10;
// 	s.width = w;
// }

function canvasToArray(canvas) {
	const array = Array(100)
		.fill()
		.map(() => Array(100));

	scale = canvas.width / 100;
	for (let x = 0; x < 100; x++) {
		for (let y = 0; y < 100; y++) {
			const pixelData = canvas
				.getContext("2d")
				.getImageData(y * scale, x * scale, 1, 1).data;
			array[x][y] = pixelData[3] == 255;
		}
	}
	return array;
}

function createMaze() {
	const canvas = document.querySelector("#maze-creator-canvas");
	const createButton = document.getElementById("create-maze");
	const creatingText = document.getElementById("creating-maze");
	createButton.style.display = "none";
	creatingText.style.display = "inline";
	const array = canvasToArray(canvas);

	const url = "http://127.0.0.1:5000/create";
	const params = {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ array }),
		method: "POST",
	};

	fetch(url, params)
		.then(function (response) {
			return response.blob();
		})
		.then(function (avatarAsBlob) {
			const objectURL = URL.createObjectURL(avatarAsBlob);
			creatingText.download = "custom-maze.JPEG";
			creatingText.href = objectURL;
			creatingText.click();
		})
		.catch((err) => {
			console.log(err);
		})
		.finally((e) => {
			createButton.style.display = "inline";
			creatingText.style.display = "none";
		});
}
