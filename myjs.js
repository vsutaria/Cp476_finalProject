var canvas;
var ctx;

/*Player and Bullet Speeds*/
var playerSpeed = 2;
var bulletSpeed = 80;

/*Player and Mouse Coordinates*/
var playerX;
var playerY;
var mouseX = 0;
var mouseY = 0;

/*Gun Size*/
var gunW = 10;
var gunH = 80;

/*Player and Bullet Radius*/
var pRadius = 40;
var bRadius = 10;

/*Key Presses*/
var kW = false;
var kA = false;
var kS = false;
var kD = false;

var fps = 60;	/*Frames Per Second (Refresh)*/

var bullets = [];	/*Bullets Spawned*/

window.onload= function(){
	var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

	canvas = document.getElementById("myCanvas");
	canvas.setAttribute("height", 0.9 * h);
	canvas.setAttribute("width", 0.9 * h);
	ctx = canvas.getContext("2d");
	playerX = canvas.width/2;
	playerY = canvas.height/2;
	canvas.addEventListener("mousemove", aimHandler, false);
	canvas.addEventListener("click", fireHandler, false);

}

/* Attach event listeners to the document */
document.addEventListener("keydown", kDownHandler, false);
document.addEventListener("keyup", kUpHandler, false);

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}

function drawPlayer() {
    ctx.beginPath();
    ctx.arc(playerX, playerY, pRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.strokeStyle = "#000000"
    ctx.stroke();
    ctx.closePath();
}

function drawGun() {
	ctx.save();
	subY = mouseY - playerY;
	subX = mouseX - playerX;

	/* Angle between mouse and player */
	var angle = Math.atan(subY/subX) + (Math.PI/2);

	if (subX >= 0){
		angle += Math.PI;	// Add 180 degrees if mouse is to the right of the player
	}


	ctx.translate(playerX, playerY);
	ctx.rotate(angle);

    ctx.beginPath();
    ctx.rect(-gunW/2, 0, gunW, gunH);
    ctx.fillStyle = "#873600";
    ctx.fill();
    ctx.strokeStyle = "#000000"
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
}

function drawBullets(){
	var i;

	for (i = 0; i < bullets.length; i++){
		ctx.beginPath();
	    ctx.arc(bullets[i][0], bullets[i][1], bRadius, 0, Math.PI*2);
	    ctx.fillStyle = "#000000";
	    ctx.fill();
	    ctx.closePath();
	}
}

function draw() {
	var del = [];
	var flag = false;
	var i;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawGun();
    drawBullets();

    
    /* Recalculate player positions */
    if(kW && playerY - playerSpeed > 0+pRadius) {
        playerY -= playerSpeed;
    }
    if(kS && playerY + playerSpeed < canvas.height-pRadius) {
        playerY += playerSpeed;
    }
    if(kA && playerX - playerSpeed > 0+pRadius) {
        playerX -= playerSpeed;
    }
    if(kD && playerX + playerSpeed < canvas.width-pRadius) {
        playerX += playerSpeed;
    }

    /* Recalculate bullet positions */
    for (i = 0; i < bullets.length; i++){
		if((bullets[i][0] + bullets[i][2] * bulletSpeed > 0+bRadius) && (bullets[i][0] + bullets[i][2] * bulletSpeed < canvas.width-bRadius)) {
        	bullets[i][0] += bullets[i][2] * bulletSpeed;
	    }
	    else{
	    	del[del.length] = i;
	    	flag = true;
	    }
	    if((bullets[i][1] + bullets[i][3] * bulletSpeed > 0+bRadius) && (bullets[i][1] + bullets[i][3] * bulletSpeed < canvas.height-bRadius)) {
        	bullets[i][1] += bullets[i][3] * bulletSpeed;
	    }
	    else{
	    	if(!flag){	// Avoid adding the same bullet twice
	    		del[del.length] = i;
	    	}
	    	flag = false;
	    }
	}

	for (i = 0; i < del.length; i++){
		bullets.splice(del[i] - i, 1);	// Remove bullets that hit objects
	}
}

function kDownHandler(e) {
    if(e.key == "w" || e.key == "W") {
        kW = true;
    }
    if(e.key == "a" || e.key == "A") {
        kA = true;
    }
    if(e.key == "s" || e.key == "S") {
        kS = true;
    }
    if(e.key == "d" || e.key == "D") {
        kD = true;
    }
}

function kUpHandler(e) {
    if(e.key == "w" || e.key == "W") {
        kW = false;
    }
    else if(e.key == "a" || e.key == "A") {
        kA = false;
    }
    else if(e.key == "s" || e.key == "S") {
        kS = false;
    }
    else if(e.key == "d" || e.key == "D") {
        kD = false;
    }
}

function aimHandler(e){
	var c = e.target.getBoundingClientRect();
	mouseX = Math.floor(e.clientX - c.left);
	mouseY = Math.floor(e.clientY - c.top);
	document.querySelector("#coords").innerHTML = "( " + mouseX + ", " + mouseY + " )";	// Report mouse coordinates in the canvas
}

function fireHandler(e){
	var i;
	var subX = mouseX - playerX;
	var subY = mouseY - playerY;
	var angle = Math.atan(subY/subX);

	if (subX < 0){
		angle += Math.PI;
	}

	bullets[bullets.length] = [];

	bullets[bullets.length-1][0] = playerX + gunH * Math.cos(angle);	//Bullet xPos
	bullets[bullets.length-1][1] = playerY + gunH * Math.sin(angle);	//Bullet yPos

	bullets[bullets.length-1][2] = (bullets[bullets.length-1][0] - playerX)/canvas.width;	//Bullet xDir
	bullets[bullets.length-1][3] = (bullets[bullets.length-1][1] - playerY)/canvas.height;	//Bullet yDir
}

setInterval(draw, 1000/fps);