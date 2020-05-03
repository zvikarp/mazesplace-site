$(document).ready(function () {
	// fade topbar on scroll
	$(window).scroll(function () {
		$("#topbar").css(
			"opacity",
			1 - $(window).scrollTop() / $("#header").height() / 0.8
		);
	});

	// scroll to section on click mazes button
	$("#mazes-button").click(function () {
		$("html, body").animate(
			{
				scrollTop: parseInt($("#mazes-section").offset().top),
			},
			700
		);
	});
});
