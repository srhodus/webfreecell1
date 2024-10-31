// vim: tabstop=4 shiftwidth=4 noexpandtab
'use strict';

var ready = (callback) => {
	if (document.readyState != "loading") {
		callback();
	} else {
		document.addEventListener("DOMContentLoaded", callback);
	}
}

ready(() => {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var image = document.getElementById("texture");
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	var table = createTable();
	console.log(JSON.stringify(table));

	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "DarkGreen";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.drawImage(image, 0, 0, 936, 384);
		window.requestAnimationFrame(draw);
	}
	window.requestAnimationFrame(draw);
});
