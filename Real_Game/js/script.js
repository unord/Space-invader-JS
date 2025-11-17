// funktion, der kører når vinduet åbnes eller opdateres
window.onload=function(){
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');
	// Opretter billeder:
	var TeaCup = new Image();
	TeaCup.src="./img/Tea_Time_Base.png";
	var projektil = new Image();
	projektil.src="./img/Tea_Time_Mist.gif";
    var invader = new Image();
	invader.src="./img/Teddy.png";
	// variabler til positioner på canvas
	var xpos = -275;
	var ypos = 500;
	var pposY = 0;
	var pposX = 177;
	var invaderPosY = Math.floor((Math.random() * 500) + 1); 
	var invaderPosX = 800;
	// boolean-variabler til tastatur-tryk
	var upPressed = false;
	var downPressed = false;
	// boolean-varibler til spil
	var skud = false;
	var hit = 0;
	// variabel til at stoppe scrol	
	var element = document.getElementById("wrapper");
	// eventlistnere
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	// funktioner til tastatur
	function keyDownHandler(e) {
    if(e.keyCode == 38) {
        upPressed = true;
		}
    else if(e.keyCode == 40) {
        downPressed = true;
		}
	else if(e.keyCode == 32){
		skud = true;
		pposY = ypos + 5;
		}
	}
	function keyUpHandler(e) {
    if(e.keyCode == 38) {
        upPressed = false;
		}
    else if(e.keyCode == 40) {
        downPressed = false;
		}
	}
	// draw-funktionen, der tegner på canvas
	function draw(context) {
		context.drawImage(TeaCup,10, ypos)
		if(skud){
			context.drawImage(projektil,pposX, pposY)
			pposX = pposX + 7;
			if(pposX > invaderPosX && pposY>invaderPosY && !(pposY > (invaderPosY+115))){
				invaderPosX = 800;
				invaderPosY = Math.floor((Math.random() * 500) + 1); 
				pposX = 177;
				skud = false;
				hit++;
				document.getElementById("hit").innerHTML = hit;
			}
		}
		if(pposX >=800){
			skud = false;
			pposX = 177;
		}
		context.drawImage(invader, invaderPosX, invaderPosY);
		invaderPosX= invaderPosX - 5;
		if(invaderPosX <= -200){
			invaderPosX = 800;
			invaderPosY = Math.floor((Math.random() * 500) + 1); 
		}
		context.restore();
		
		if(upPressed && ypos > 0) {
			ypos -= 7;
		}
		else if(downPressed && ypos < 500) {
			ypos += 7;
		}		
		element.scrollIntoView({block: "start"});
	}
	// animate-funktionen, der kører hvert 10.milisekund
	function animate() {
			context.clearRect(0, 0, 800, 600);
			draw(context);
			setTimeout(animate, 10);
			
	};	
	animate();
};