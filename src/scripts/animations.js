$(document).ready(function () {
	// scroll effects
	// $(window).scroll(function () {
	// 	// fade topbar on scroll
	// 	var fade = 1 - $(window).scrollTop() / $("#header").height() / 0.8;
	// 	$("#topbar").css("opacity", fade);
	// 	$("#topbar").css("display", fade > 0 ? "inline" : "none");

	// 	// word maze parallax effect
	// 	const wordMazeSection = $("#section-maze-generator");
	// 	const sectionOffset = wordMazeSection.offset().top;
	// 	const topViewoprt = sectionOffset - $(window).height();
	// 	const bottomViewport = sectionOffset + wordMazeSection.height();
	// 	const windowViewport = (bottomViewport - topViewoprt) * 0.02;
	// 	const percentage =
	// 		($(window).scrollTop() - topViewoprt) / windowViewport + 25;
	// 	wordMazeSection.css("background-position", percentage + "% 50%");
	// });

	// scroll to section on click
	function onClickScrollTo(onClick, scrollTo) {
		$(onClick).click(function () {
			$("html, body").animate(
				{
					scrollTop: parseInt($(scrollTo).offset().top),
				},
				700
			);
		});
	}

	onClickScrollTo("#mazes-button", "#mazes-section");
	onClickScrollTo("#about-button", "#about-section");

	// flashlight effect
	var headerFlashlight = document.querySelector("#header-mouseover");
	function updateFlashlight(e) {
		try {
			e.touches = e.touches || [];
			const x = e.clientX || e.touches[0].clientX;
			const y = e.clientY || e.touches[0].clientY;
			const scrollTop =
				window.pageYOffset || document.documentElement.scrollTop;
			headerFlashlight.style.setProperty("--cursorX", x + "px");
			headerFlashlight.style.setProperty(
				"--cursorY",
				y + scrollTop + "px"
			);
		} catch (error) {}
	}
	headerFlashlight.addEventListener("mousemove", updateFlashlight);
	headerFlashlight.addEventListener("touchmove", updateFlashlight);

	// maze creator

	function getCanvasSize() {
		const screenWidth = window.innerWidth;
		if (screenWidth < 450) return screenWidth - 50;
		else if (screenWidth < 1000) return 500;
		return 700;
	}

	function updateBoardsSize(newSize) {
		const ratio = newSize[1] / newSize[0];
		const newWidth = getCanvasSize();
		const newHeight = newWidth * ratio;
		mazeCanvas.height = newHeight;
		mazeCanvas.width = newWidth;
		randomizePointsLocation();
		draggableArea.style.height = `${newHeight.toString()}px`;
		draggableArea.style.width = `${newWidth.toString()}px`;
	}

	function updateBrushSize(newSize) {
		brushSize = screenWidth > 450 ? newSize : newSize / 2;
	}

	function randomizePointsLocation() {
		Object.values(pnts).forEach((pnt) => {
			const rndWidth = Math.floor(
				Math.random() * (mazeCanvas.width - pnts.str.elmt.clientWidth)
			);
			const rndHeight = Math.floor(
				Math.random() * (mazeCanvas.height - pnts.str.elmt.clientHeight)
			);
			movePointsToXY(pnt, rndWidth, rndHeight);
		});
	}

	const mazeCanvas = document.querySelector("#maze-creator-canvas");
	const draggableArea = document.querySelector("#maze-creator-draggable");
	const strElmt = document.querySelector("#maze-creator-start");
	const endElmt = document.querySelector("#maze-creator-end");
	const canvasCtx = mazeCanvas.getContext("2d");
	const screenWidth = window.innerWidth;
	let pnts = {
		str: { id: "str", elmt: strElmt },
		end: { id: "end", elmt: endElmt },
	};
	let canvasPrevEvent;
	let canvasMouseDown = false;
	let brushSize = 0;
	let pointSelected;

	updateBoardsSize([100, 100]);
	updateBrushSize(40);
	randomizePointsLocation();

	$("#maze-creator-board-size").on("change", function (e) {
		updateBoardsSize(this.value.split("x"));
	});
	$("#maze-creator-brush-size").on("change", function (e) {
		updateBrushSize(parseInt(this.value));
	});

	function getXYFromEvent(event) {
		event.touches = event.touches || [];
		const x =
			event.offsetX ||
			event.touches[0].clientX +
				document.body.scrollLeft +
				document.documentElement.scrollLeft -
				mazeCanvas.offsetLeft;
		const y =
			event.offsetY ||
			event.touches[0].clientY +
				document.body.scrollTop +
				document.documentElement.scrollTop -
				mazeCanvas.offsetTop;
		return [x, y];
	}

	function moveMazeCanvas(event) {
		if (!canvasMouseDown) return;
		const [x, y] = getXYFromEvent(event);
		const [lastX, lastY] = getXYFromEvent(canvasPrevEvent);
		canvasCtx.beginPath();
		canvasCtx.moveTo(lastX, lastY);
		canvasCtx.lineTo(x, y);
		canvasCtx.lineWidth = brushSize;
		canvasCtx.lineCap = "round";
		canvasCtx.stroke();
		canvasPrevEvent = event;
	}

	function downMazeCanvas(event) {
		pnts.str.elmt.style.pointerEvents = "none";
		pnts.end.elmt.style.pointerEvents = "none";
		canvasPrevEvent = event;
		canvasMouseDown = true;
	}

	function upMazeCanvas(_) {
		pnts.str.elmt.style.pointerEvents = "auto";
		pnts.end.elmt.style.pointerEvents = "auto";
		canvasMouseDown = false;
	}

	function validatePointXY(x, y) {
		const inRange =
			x < mazeCanvas.width - pnts.str.elmt.clientWidth &&
			y < mazeCanvas.height - pnts.str.elmt.clientHeight;
		return x >= 0 && y >= 0 && inRange;
	}

	function movePointsToXY(pnt, x, y) {
		pnt.elmt.style.top = `${y}px`;
		pnt.elmt.style.left = `${x}px`;
	}

	function movePoint(event) {
		event = event.clientX ? event : event.touches[0];
		if (!pointSelected) return;
		pnt = pnts[pointSelected];
		const x = pnt.elmt.offsetLeft - (pnt.prev.clientX - event.clientX);
		const y = pnt.elmt.offsetTop - (pnt.prev.clientY - event.clientY);
		if (!validatePointXY(x, y)) return;
		movePointsToXY(pnt, x, y);
		pnt.prev = event;
	}

	function downPnt(event, pntId) {
		pnts[pntId].prev = event.clientX ? event : event.touches[0];
		draggableArea.style.pointerEvents = "auto";
		pointSelected = pntId;
	}

	function upPnt(_) {
		draggableArea.style.pointerEvents = "none";
		pointSelected = false;
	}

	function createListeners(element, onDown, onMove, onUp) {
		element.addEventListener("touchstart", onDown);
		element.addEventListener("mousedown", onDown);
		element.addEventListener("mousemove", onMove);
		element.addEventListener("touchmove", onMove);
		element.addEventListener("touchend", onUp);
		element.addEventListener("mouseup", onUp);
	}

	createListeners(mazeCanvas, downMazeCanvas, moveMazeCanvas, upMazeCanvas);
	createListeners(pnts.str.elmt, (e) => downPnt(e, "str"), null, upPnt);
	createListeners(pnts.end.elmt, (e) => downPnt(e, "end"), null, upPnt);
	createListeners(draggableArea, null, (e) => movePoint(e), null);
});
