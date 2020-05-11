$(document).ready(function () {
	// fade topbar on scroll
	$(window).scroll(function () {
		$("#topbar").css(
			"opacity",
			1 - $(window).scrollTop() / $("#header").height() / 0.8
		);
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
	onClickScrollTo("#about-button", "#about-section")

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
});
