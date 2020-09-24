function clearCreateMazeCanvas() {
	const canvas = document.getElementById("maze-creator-canvas");
	const size = getCanvasSize();
	const context = canvas.getContext("2d");
	context.clearRect(0, 0, size, size);
}

function getCanvasSize() {
	const screenWidth = window.innerWidth;
	if (screenWidth < 450) return screenWidth - 50;
	return 500;
}

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
	const flag=0;

	// const url = "https://mazesplace-server.herokuapp.com/create";
	const url = "http://127.0.0.1:5000/create";
	const params = {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ flag, array }),
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
			clearCreateMazeCanvas();
		})
		.catch((err) => {
			console.log(err);
		})
		.finally((e) => {
			createButton.style.display = "inline";
			creatingText.style.display = "none";
		});
}
/*@ARC*/ 
function createMazeWithSpesificSolotion() {
	const canvas = document.querySelector("#maze-creator-canvas");
	const createButton = document.getElementById("create-maze");
	const creatingText = document.getElementById("creating-maze");
	createButton.style.display = "none";
	creatingText.style.display = "inline";
	const array = canvasToArray(canvas);
	const flag=1;

	// const url = "https://mazesplace-server.herokuapp.com/create";
	const url = "http://127.0.0.1:5000/create";
	const params = {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ flag ,array }),
		method: "POST",
	};
	//window.alert(params.body)

	fetch(url, params)
		.then(function (response) {
			return response.blob();
		})
		.then(function (avatarAsBlob) {
			const objectURL = URL.createObjectURL(avatarAsBlob);
			creatingText.download = "custom-maze.JPEG";
			creatingText.href = objectURL;
			creatingText.click();
			clearCreateMazeCanvas();
		})
		.catch((err) => {
			console.log(err);
		})
		.finally((e) => {
			createButton.style.display = "inline";
			creatingText.style.display = "none";
		});
		
}
