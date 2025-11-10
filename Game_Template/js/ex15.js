
window.onload=function(){
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');
	var volvo = new Image();
	volvo.src="./img/volvo.png";
	var sne = new Image();
	sne.src="./img/sne.png";
	var xpos = -275;
	var ypos = -200;
	
	function draw(context) {
		context.drawImage(sne,0,ypos);
		context.drawImage(volvo,xpos,80);
		context.restore();	
	}
	
	function animate() {
			xpos++;
			ypos++;
			context.clearRect(0, 0, 800, 200);
			draw(context);
			setTimeout(animate, 10);
			if (xpos >= 800){
				xpos = -275;
			}
			if (ypos >= 200){
				ypos = -400;
			}
	};	
	animate();
};