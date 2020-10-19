function setVh() {
	let vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty("--vh", `${vh}px`);
}

window.addEventListener("resize", () => setVh);

setVh();

function downloadMaze(mazeName) {
	logEvent("maze", mazeName, mazeName);
	window.open(
		`assets/mazes/downloadables/${mazeName}--Downloadable.pdf`,
		"_blank"
	);
}

function logEvent(type, id, name) {
	firebase.analytics().logEvent("select_content", {
		content_type: type,
		content_id: id,
		items: [{ name: name }],
	});
}
