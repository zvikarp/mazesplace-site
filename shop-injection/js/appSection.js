document.addEventListener("readystatechange", (event) => {
	if (event.target.readyState === "interactive") {

		alert("hi 1");

		const appSection = document.createElement("div");

		const html = appSection.innerHTML(`
		<h2>Get the mobile app</h2>
		<p>Use our customized mobile app to scan the mazes and get live information about them.</p>
		<a href='https://play.google.com/store/apps/details?id=com.zektec.mazesplace_app&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'/></a>		
		`);

		const main = document.getElementById("main");
		main.appendChild(html);
	}
});
