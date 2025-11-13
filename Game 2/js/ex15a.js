window.onload = function() {
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');
	var volvo = new Image();
	volvo.src = "./img/volvo.png";
	var sne = new Image();
	sne.src = "./img/sne.png";
	var loko = new Image();
	loko.src = "./img/lokomotiv.png";
	var helo = new Image();
	helo.src = "./img/helo.png";
	var xpos = -275;
	var ypos = -200;
	var scene = 1;

	function draw(context) {
		switch (scene) {
		case 1:
			context.drawImage(sne, 0, ypos);
			context.drawImage(volvo, xpos, 80);
			context.restore();
			break;
		case 2:
			context.drawImage(helo, (xpos-475)*-1, 40);
			context.drawImage(loko, xpos, 80);
			context.restore();
			break;
		case 3:
			scene = 1;
			break;
		default:
			break;
		}
	}

	function animate() {
		xpos++;
		ypos++;
		context.clearRect(0, 0, 800, 200);
		draw(context);
		setTimeout(animate, 10);
		if (xpos >= 800) {
			xpos = -275;
			scene++;
		}
		if (ypos >= 200) {
			ypos = -400;
		}
	}
	;
	animate();
};