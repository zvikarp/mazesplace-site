$(document).ready(function () {
	// scroll effects
	$(window).scroll(function () {
		// fade topbar on scroll
		var fade = 1 - $(window).scrollTop() / $("#header").height() / 0.8;
		$("#topbar").css("opacity", fade);
		$("#topbar").css("display", fade > 0 ? "inline" : "none");

		// word maze parallax effect
		const wordMazeSection = $("#section-maze-generator");
		const sectionOffset = wordMazeSection.offset().top;
		const topViewoprt = sectionOffset - $(window).height();
		const bottomViewport = sectionOffset + wordMazeSection.height();
		const windowViewport = (bottomViewport - topViewoprt) * 0.02;
		const percentage =
			($(window).scrollTop() - topViewoprt) / windowViewport + 25;
		wordMazeSection.css("background-position", percentage + "% 50%");
	});

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
		e.touches = e.touches || [];
		var x = e.clientX || e.touches[0].clientX;
		var y = e.clientY || e.touches[0].clientY;
		var scrollTop =
			window.pageYOffset || document.documentElement.scrollTop;
		headerFlashlight.style.setProperty("--cursorX", x + "px");
		headerFlashlight.style.setProperty("--cursorY", y + scrollTop + "px");
	}
	headerFlashlight.addEventListener("mousemove", updateFlashlight);
	headerFlashlight.addEventListener("touchmove", updateFlashlight);

	const canvas = document.querySelector("#maze-creator-canvas");
	const context = canvas.getContext("2d");
	let lastEvent;
	let mouseDown = false;

	canvas.addEventListener("mousemove", onMoveOnCanvas);
	canvas.addEventListener("touchmove", onMoveOnCanvas);
	canvas.addEventListener("mousedown", onMouseDownOnCanvas);
	canvas.addEventListener("mouseup", onMouseUpOnCanvas);
	canvas.addEventListener("mouseleave", onMouseUpOnCanvas);

	canvas.addEventListener("touchstart", onMouseDownOnCanvas);
	canvas.addEventListener("touchend", onMouseUpOnCanvas);

	function onMoveOnCanvas(e) {
		if (mouseDown) {
			e.touches = e.touches || [];
			const x = e.offsetX || e.touches[0].clientX;
			const y = e.offsetY || e.touches[0].clientY;

			lastEvent.touches = lastEvent.touches || [];
			const lastEventX =
				lastEvent.offsetX || lastEvent.touches[0].clientX;
			const lastEventY =
				lastEvent.offsetY || lastEvent.touches[0].clientY;

			context.beginPath();
			context.moveTo(lastEventX, lastEventY);
			context.lineTo(x, y);
			context.lineWidth = 40;
			context.lineCap = "round";
			context.stroke();
			lastEvent = e;
		}
	}

	function onMouseDownOnCanvas(e) {
		lastEvent = e;
		mouseDown = true;
	}
	function onMouseUpOnCanvas() {
		mouseDown = false;
	}
});
