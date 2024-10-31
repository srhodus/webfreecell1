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
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "DarkGreen";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		window.requestAnimationFrame(draw);
	}
	window.requestAnimationFrame(draw);
});
