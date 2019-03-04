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

/* Draw map flag */
var mapFlag=false;

var fps = 60;	/*Frames Per Second (Refresh)*/

var bullets = [];	/*Bullets Spawned*/

var mapObjects=new Array(); /* saving all objects drawn*/

function collision( checkingX,checkingY ){ 
	var i;
	var checkX=false;
	var checkY=false;
	var countX=0;
	var countY=0;
	for (i=0;i<mapObjects.length;i++){
	
		if (checkingX >=mapObjects[i].startingX && checkingX <=mapObjects[i].endingX ){
			countX++;
		}
		if (checkingY >=mapObjects[i].startingY && checkingY <=mapObjects[i].endingY ){
			countY++;
		}	
	}
	if (mapObjects.length==countX){
		checkX =true;		
	}
	if (mapObjects.length==countY){
		checkY =true;		
	}
	
	return checkX,checkY;
	
}

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
class RectangleComponent{
	constructor(x, y,color,width, height) {
		this.width = width;
		this.height = height;
		this.startX = x;
		this.startY = y;
		this.endX = x +width;
		this.endY = y +height;
		
		this.color=color;
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.fillRect(this.startX, this.startY, this.width, this.height);
		ctx.closePath();
	}
	get startingX() {
		return this.startX;
	}
	get startingY() {
		return this.startY;
	}	
	get endingX() {
		return this.endX;
	}
	get endingY() {
		return this.endX;
	}
}
function drawMap(){
	/*Control the size of the obstacles*/
	var obstacle1=100;
	var obstacle2=20;	
	
	/*Control the size of the map not the canvas*/
	var mapMaxX=2500;
	var mapMinX=-2500;
	var mapMaxY=2500;
	var mapMinY=-2500;
	var mapMinY=-2500;

	var mapCenterX=0;
	var mapCenterY=0;
	/*top line 1st  obstacle*/
	var rect1 = new RectangleComponent(mapMinX+500,mapMaxY-100,"red",obstacle1,obstacle2);
	mapObjects[0]=rect1;
	var rect2 = new RectangleComponent(mapMinX+580,mapMaxY-120,"red",obstacle2,obstacle1);
	mapObjects[1]=rect2;
	
	/*top line 2nd  obstacle*/
	var rect3 = new RectangleComponent((mapMinX+1000)-80,mapMaxY-100,"red",obstacle1,obstacle2);
	mapObjects[2]=rect3;
	var rect4 = new RectangleComponent((mapMinX+1000)-80,mapMaxY-120,"red",obstacle2,obstacle1);
	mapObjects[3]=rect4;
	
	/* /*top line 3rd  obstacle*/
	var rect9 = new RectangleComponent(mapMinX+1500,mapMaxY-100,"red",obstacle1,obstacle2);
	mapObjects[4]=rect9;
	var rect10 = new RectangleComponent(mapMinX+1580,mapMaxY-120,"red",obstacle2,obstacle1);
	mapObjects[5]=rect10;
	
	/*top line 4th  obstacle*/
	var rect13 = new RectangleComponent((mapMinX+2000)-80,mapMaxY-100,"red",obstacle1,obstacle2);
	mapObjects[6]=rect13;
	var rect14 = new RectangleComponent((mapMinX+2000)-80,mapMaxY-120,"red",obstacle2,obstacle1);
	mapObjects[7]=rect14;
	
	/*top line 5th  obstacle*/
	var rect17 = new RectangleComponent(mapCenterX,mapMaxY-100,"red",obstacle1,obstacle2);
	mapObjects[8]=rect17;
	var rect18 = new RectangleComponent(mapCenterX,mapMaxY-120,"red",obstacle2,obstacle1);
	mapObjects[9]=rect18;
	
	/*top line 6th  obstacle*/
	var rect19 = new RectangleComponent((mapMaxX-2000)-80,mapMaxY-100,"red",obstacle1,obstacle2);
	mapObjects[10]=rect19;
	var rect20 = new RectangleComponent((mapMaxX-2000)-80,mapMaxY-120,"red",obstacle2,obstacle1);
	mapObjects[11]=rect20;
	
	/*top line 7th  obstacle*/
	var rect21 = new RectangleComponent(mapMaxX-1500,mapMaxY-100,"red",obstacle1,obstacle2);
	mapObjects[12]=rect21;
	var rect22 = new RectangleComponent(mapMaxX-1580,mapMaxY-120,"red",obstacle2,obstacle1);
	mapObjects[13]=rect22;
	
	/*top line 8th  obstacle*/
	var rect23 = new RectangleComponent((mapMaxX-2000)-80,mapMaxY-100,"red",obstacle1,obstacle2);
	mapObjects[14]=rect23;
	var rect24 = new RectangleComponent((mapMaxX-2000)-80,mapMaxY-120,"red",obstacle2,obstacle1);
	mapObjects[15]=rect24;
	
	/*top line 9th  obstacle*/
	var rect35 = new RectangleComponent(mapMaxX-500,mapMaxY-100,"red",obstacle1,obstacle2);
	mapObjects[16]=rect35;
	var rect36 = new RectangleComponent(mapMaxX-580,mapMaxY-120,"red",obstacle2,obstacle1);
	mapObjects[17]=rect36;
	
	/*bottom line 1st  obstacle*/
	var rect5 = new RectangleComponent(mapMinX+500,mapMinY+120,"red",obstacle1,obstacle2);
	mapObjects[18]=rect5;
	var rect6 = new RectangleComponent(mapMinX+500,mapMinY+220,"red",obstacle2,obstacle1);
	mapObjects[19]=rect6;
	/*bottom line 2nd  obstacle*/
	var rect7 = new RectangleComponent((mapMinX+1000)-80,mapMinY+120,"red",obstacle1,obstacle2);
	mapObjects[20]=rect7;
	var rect8 = new RectangleComponent((mapMinX+1000),mapMinY+220,"red",obstacle2,obstacle1);
	mapObjects[21]=rect8;	
	/*bottom line 3rd  obstacle*/
	var rect11 = new RectangleComponent(mapMinX+1500,mapMinY+120,"red",obstacle1,obstacle2);
	mapObjects[22]=rect11;
	var rect12 = new RectangleComponent(mapMinX+1500,mapMinY+220,"red",obstacle2,obstacle1);
	mapObjects[23]=rect12;
	
	/*bottom line 4th  obstacle*/
	var rect15 = new RectangleComponent((mapMinX+2000)-80,mapMinY+120,"red",obstacle1,obstacle2);
	mapObjects[24]=rect15;
	var rect16 = new RectangleComponent((mapMinX+2000),mapMinY+220,"red",obstacle2,obstacle1);
	mapObjects[25]=rect16;	
	
	/*bottom line 5th  obstacle*/
	var rect25 = new RectangleComponent(mapCenterX,mapMinY+120,"red",obstacle1,obstacle2);
	mapObjects[26]=rect25;
	var rect26 = new RectangleComponent(mapCenterX,mapMinY+220,"red",obstacle2,obstacle1);
	mapObjects[27]=rect26;
	/*bottom line 6th  obstacle*/
	var rect27 = new RectangleComponent((mapMaxX-2000)-80,mapMinY+120,"red",obstacle1,obstacle2);
	mapObjects[28]=rect27;
	var rect28 = new RectangleComponent((mapMaxX-2000),mapMinY+220,"red",obstacle2,obstacle1);
	mapObjects[29]=rect28;	
	/*bottom line 7th  obstacle*/
	var rect29 = new RectangleComponent(mapMaxX-1500,mapMinY+120,"red",obstacle1,obstacle2);
	mapObjects[30]=rect29;
	var rect30 = new RectangleComponent(mapMaxX-1500,mapMinY+220,"red",obstacle2,obstacle1);
	mapObjects[31]=rect30;
	
	/*bottom line 8th  obstacle*/
	var rect31 = new RectangleComponent((mapMaxX-1000)-80,mapMinY+120,"red",obstacle1,obstacle2);
	mapObjects[32]=rect31;
	var rect32 = new RectangleComponent((mapMaxX-1000),mapMinY+220,"red",obstacle2,obstacle1);
	mapObjects[33]=rect32;	
	
	/*bottom line 9th  obstacle*/
	var rect33 = new RectangleComponent(mapMaxX-500,mapMinY+120,"red",obstacle1,obstacle2);
	mapObjects[34]=rect33;
	var rect34 = new RectangleComponent(mapMaxX-500,mapMinY+220,"red",obstacle2,obstacle1);
	mapObjects[35]=rect34;
	
	/* The house in the left*/
	/*top wall*/
	var house1Wall1= new RectangleComponent((mapMinX/2)+200,(mapCenterY)-200,"Chocolate",400,20);
	mapObjects[36]=house1Wall1;
	/*left side wall*/
	var house1Wall2 = new RectangleComponent((mapMinX/2)+200,(mapCenterY)-180,"Chocolate",20,400);
	mapObjects[37]=house1Wall2;
	/*bottom wall*/
	var house1Wall3= new RectangleComponent((mapMinX/2)+200,(mapCenterY)+220,"Chocolate",300,20);
	mapObjects[38]=house1Wall3;
	/*right side wall*/
	var house1Wall4 = new RectangleComponent((mapMinX/2)-180,(mapCenterY)-180,"Chocolate",20,400);
	mapObjects[39]=house1Wall4;
	
	/*door side wall*/
	var house1Door = new RectangleComponent((mapMinX/2)-180,(mapCenterY)+220,"brown",20,75);
	mapObjects[40]=house1Door;
	
	/* The house in the middle*/
	/*top wall*/
	var house2Wall1= new RectangleComponent((mapCenterX)-100,(mapCenterY)-200,"Chocolate",300,20);
	
	mapObjects[41]=house2Wall1;
	/*left side wall*/
	var house2Wall2 = new RectangleComponent((mapCenterX)-200,(mapCenterY)-180,"Chocolate",20,400);
	mapObjects[42]=house2Wall2;
	
	/*bottom wall*/
	var house2Wall3= new RectangleComponent((mapCenterX)-200,(mapCenterY)+220,"Chocolate",300,20);
	mapObjects[43]=house2Wall3;
	/*right side wall*/
	var house2Wall4 = new RectangleComponent((mapCenterX)+180,(mapCenterY)-180,"Chocolate",20,400);
	mapObjects[44]=house2Wall4;
	
	/*door side wall*/
	var house2Door = new RectangleComponent((mapCenterX)+180,(mapCenterY)+220,"brown",20,75);
	mapObjects[45]=house2Door;
	/*door side wall*/
	var house2Door2 = new RectangleComponent((mapCenterX)-200,(mapCenterY)-250,"brown",20,75);
	mapObjects[46]=house2Door2;
	
	
	/* The house in the right*/
	/*top wall*/  
	var house3Wall1= new RectangleComponent((mapMaxX/2)-200,(mapCenterY)-200,"Chocolate",300,20);
	mapObjects[47]=house3Wall1;
	/*left side wall*/
	var house3Wall2 = new RectangleComponent((mapMaxX/2)-200,(mapCenterY)-180,"Chocolate",20,400);
	mapObjects[48]=house3Wall2;
	/*bottom wall*/
	var house3Wall3= new RectangleComponent((mapMaxX/2)-200,(mapCenterY)+220,"Chocolate",400,20);
	mapObjects[49]=house3Wall3;
	/*right side wall*/
	var house3Wall4 = new RectangleComponent((mapMaxX/2)+180,(mapCenterY)-180,"Chocolate",20,400);
	mapObjects[50]=house3Wall4;
	
	/*door side wall*/
	var house3Door = new RectangleComponent((mapMaxX/2)+180,(mapCenterY)-250,"brown",20,75);
	mapObjects[51]=house3Door; 
	
	
}
function draw() {
	var del = [];
	var flag = false;
	var i;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	//if (flag==false){
	drawMap();
		//mapFlag=true;
		
	//}
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
