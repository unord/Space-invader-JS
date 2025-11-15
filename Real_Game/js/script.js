// funktion, der kører når vinduet åbnes eller opdateres
window.onload=function(){
	var canvas = document.getElementById('myCanvas');
	var context = canvas.getContext('2d');
	// Opretter billeder:
	var TeaCup = new Image();
	TeaCup.src="./img/Tea_Time_Base.png";
	var projektil = new Image();
	projektil.src="./img/Tea_Time_Mist.gif";
	var trold = new Image();
	trold.src="./img/trold.png";
}