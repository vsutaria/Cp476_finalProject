window.onload = function(){

window.MyGame = {};	/*Game Object*/

/*Key Presses and Mouse Coords*/
MyGame.controls = {
	kW: false,
	kA: false,
	kS: false,
	kD: false,
	xMouse: 0,
	yMouse: 0
}

/*Active Bullets*/
MyGame.bullets = [];

/*Rectangle Object*/
(function(){
	function RectangleComponent(x, y,width, height) {
		this.width = width || 0;
		this.height = height || 0;
		this.xStart = x || 0;
		this.yStart = y || 0;
		this.xEnd = x + width;
		this.yEnd = y + height;
	}

	RectangleComponent.prototype.set = function(x, y, width, height){
		this.width = width || this.width;
		this.height = height || this.height;
		this.xStart = x || this.xStart;
		this.yStart = y || this.yStart;
		this.xEnd = this.xStart + this.width;
		this.yEnd = this.yStart + this.height;
	}

	RectangleComponent.prototype.inside = function(m){
		return (m.xStart <= this.xStart && m.xEnd >= this.xEnd &&
			m.yStart <= this.yStart && m.yEnd >= this.yEnd);
	}

	RectangleComponent.prototype.cover = function(m){
		return(this.xStart < m.xEnd && m.xStart < this.xEnd &&
			this.yStart < m.yEnd && m.yStart < this.yEnd);
	}

	MyGame.RectangleComponent = RectangleComponent;
})();

/*Camera Object*/
(function(){

	var DIR = {
		NONE: "none",
		HORIZONTAL: "horizontal",
		VERTICAL: "vertical",
		BOTH: "both"
	};

	function Camera(xPos, yPos, cvsWidth, cvsHeight, mapWidth, mapHeight){
		this.xPos = xPos || 0;
		this.yPos = yPos || 0;

		/*Used to detect map walls*/
		this.xWall = 0;
		this.yWall = 0;

		/*Size of the html canvas*/
		this.cvsWidth = cvsWidth;
		this.cvsHeight = cvsHeight;

		this.dir = DIR.BOTH;

		this.following = null;

		/*Viewport Rectangle*/
		this.vpRect = new MyGame.RectangleComponent(this.xPos, this.yPos, this.cvsWidth, this.cvsHeight);

		/*Map Rectangle*/
		this.mapRect = new MyGame.RectangleComponent(0, 0, mapWidth, mapHeight);
	}

	/*Assign a player for the camera to follow*/
	Camera.prototype.follow = function(playerObj, xWall, yWall){
		this.following = playerObj;
		this.xWall = xWall;
		this.yWall = yWall;
	}

	Camera.prototype.update = function(){
		if(this.following != null){
			if(this.dir == DIR.HORIZONTAL || this.dir == DIR.BOTH){
				/*Ensure the Camera does not leave the Map on x axis*/
				if(this.following.xPos - this.xPos + this.xWall > this.cvsWidth){
					this.xPos = this.following.xPos - this.cvsWidth + this.xWall;
				}
				else if(this.following.xPos - this.xWall < this.xPos){
					this.xPos = this.following.xPos - this.xWall;
				}
			}
			if(this.dir == DIR.VERTICAL || this.dir == DIR.BOTH){
				/*Ensure the Camera does not leave the Map on y axis*/
				if(this.following.yPos - this.yPos + this.yWall > this.cvsHeight){
					this.yPos = this.following.yPos - this.cvsHeight + this.yWall;
				}
				else if(this.following.yPos - this.yWall < this.yPos){
					this.yPos = this.following.yPos - this.yWall;
				}
			}
		}

		this.vpRect.set(this.xPos, this.yPos);

		if(!this.vpRect.inside(this.mapRect)){
			if(this.vpRect.xStart < this.mapRect.xStart){
				this.xPos = this.mapRect.xStart;
			}
			if(this.vpRect.yStart < this.mapRect.yStart){
				this.yPos = this.mapRect.yStart;
			}
			if(this.vpRect.xEnd > this.mapRect.xEnd){
				this.xPos = this.mapRect.xEnd - this.cvsWidth;
			}
			if(this.vpRect.yEnd > this.mapRect.yEnd){
				this.yPos = this.mapRect.yEnd - this.cvsHeight;
			}
		}
	}

	MyGame.Camera = Camera;

})();

(function(){
	function Player(x, y, sPlayer, rPlayer){
		this.xPos = x;
		this.yPos = y;

		this.speed = sPlayer;

		this.radius = rPlayer;
	}

	Player.prototype.update = function(step, mapWidth, mapHeight, walls){
		if(MyGame.controls.kA){
			this.xPos -= this.speed * step;
			for(var i = 0; i < walls.length; i++){
				var w = walls[i].getCoords();
				if(this.xPos - this.radius > w[0] && this.xPos - this.radius < w[1] 
					&& ((this.yPos - this.radius > w[2] && this.yPos - this.radius < w[3]) || (this.yPos + this.radius > w[2] && this.yPos + this.radius < w[3]) || (this.yPos - this.radius < w[2] && this.yPos + this.radius > w[3]))) {
					this.xPos += this.speed * step;
				}
			}
		}
		if(MyGame.controls.kD){
			this.xPos += this.speed * step;
			for(var i = 0; i < walls.length; i++){
				var w = walls[i].getCoords();
				if(this.xPos + this.radius > w[0] && this.xPos + this.radius < w[1] && ((this.yPos - this.radius > w[2] && this.yPos - this.radius < w[3]) || (this.yPos + this.radius > w[2] && this.yPos + this.radius < w[3]) || (this.yPos - this.radius < w[2] && this.yPos + this.radius > w[3]))){
					this.xPos -= this.speed * step;
				}
			}
		}
		if(MyGame.controls.kW){
			this.yPos -= this.speed * step;
			for(var i = 0; i < walls.length; i++){
				var w = walls[i].getCoords();
				if(this.yPos - this.radius > w[2] && this.yPos - this.radius < w[3] && ((this.xPos - this.radius > w[0] && this.xPos - this.radius < w[1]) || (this.xPos + this.radius > w[0] && this.xPos + this.radius < w[1]) || (this.xPos - this.radius < w[0] && this.xPos + this.radius > w[1]))){
					this.yPos += this.speed * step;
				}
			}
		}
		if(MyGame.controls.kS){
			this.yPos += this.speed * step;
			for(var i = 0; i < walls.length; i++){
				var w = walls[i].getCoords();
				if(this.yPos + this.radius > w[2] && this.yPos + this.radius < w[3] && ((this.xPos - this.radius > w[0] && this.xPos - this.radius < w[1]) || (this.xPos + this.radius > w[0] && this.xPos + this.radius < w[1]) || (this.xPos - this.radius < w[0] && this.xPos + this.radius > w[1]))){
					this.yPos -= this.speed * step;
				}
			}
		}

		if(this.xPos - this.radius < 0){
			this.xPos = this.radius;
		}
		if(this.xPos + this.radius > mapWidth){
			this.xPos = mapWidth - this.radius;
		}
		if(this.yPos - this.radius < 0){
			this.yPos = this.radius;
		}
		if(this.yPos + this.radius > mapHeight){
			this.yPos = mapHeight - this.radius;
		}
	}

	Player.prototype.draw = function(ctx, xCvs, yCvs){
		ctx.save();
		ctx.beginPath();
		ctx.arc(this.xPos - xCvs, this.yPos - yCvs, this.radius, 0, Math.PI*2);
		ctx.fillStyle = "#0095DD";
		ctx.fill();
		ctx.strokeStyle = "#000000"
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	}

	Player.prototype.getPos = function(){
		return [~~(this.xPos/1), ~~(this.yPos/1)];
	}

	MyGame.Player = Player;
})();

(function(){
	function Gun(x, y){
		this.xPos = x;
		this.yPos = y;

		this.width = 10;
		this.height = 80;

		this.angle = 0;
	}

	Gun.prototype.update = function(x, y, xCvs, yCvs){
		this.xPos = x;
		this.yPos = y;

		this.angle = Math.atan(~~((MyGame.controls.yMouse - (this.yPos - yCvs))/1) / ~~((MyGame.controls.xMouse - (this.xPos - xCvs))/1)) + (Math.PI/2);

		if(~~((MyGame.controls.xMouse - (this.xPos - xCvs))/1) >= 0){
			this.angle += Math.PI;
		}
	}

	Gun.prototype.draw = function(ctx, xCvs, yCvs){
		ctx.save();
		ctx.translate(this.xPos - xCvs, this.yPos - yCvs);
		ctx.rotate(this.angle);

		ctx.beginPath();
		ctx.rect(-this.width/2, 0, this.width, this.height);
		ctx.fillStyle = "#873600";
		ctx.fill();
		ctx.strokeStyle = "#000000"
		ctx.stroke();
		ctx.closePath();

		ctx.restore();
		document.querySelector("#coords").innerHTML = "( " + ~~(this.xPos/1 - xCvs) + ", " + ~~(this.yPos/1 - yCvs) + " )" + "( " + MyGame.controls.xMouse + ", " + MyGame.controls.yMouse + " )" + "( " + this.angle  + " )";	// Report mouse coordinates in the canvas
	};

	Gun.prototype.getHeight = function(){
		return this.height;
	}

	Gun.prototype.getAngle = function(){
		return this.angle;
	}

	MyGame.Gun = Gun;
})();

(function(){
	function Bullet(xp, yp, xd, yd, sBullet, rBullet){
		this.xPos = xp;
		this.yPos = yp;

		this.xDir = xd;
		this.yDir = yd

		this.speed = sBullet;
		this.radius = rBullet;

		this.spawned = true;

	}

	Bullet.prototype.update = function(step, mapWidth, mapHeight, walls){
		this.xPos += this.xDir * this.speed * step;
		this.yPos += this.yDir * this.speed * step;

		for(var i = 0; i < walls.length; i++){
			var w = walls[i].getCoords();
			if(this.xPos - this.radius > w[0] && this.xPos - this.radius < w[1]
				&& ((this.yPos - this.radius > w[2] && this.yPos - this.radius < w[3]) || (this.yPos + this.radius > w[2] && this.yPos + this.radius < w[3]) || (this.yPos - this.radius < w[2] && this.yPos + this.radius > w[3]))) {
				this.spawned = false;
			}
			if(this.xPos + this.radius > w[0] && this.xPos + this.radius < w[1]
				&& ((this.yPos - this.radius > w[2] && this.yPos - this.radius < w[3]) || (this.yPos + this.radius > w[2] && this.yPos + this.radius < w[3]) || (this.yPos - this.radius < w[2] && this.yPos + this.radius > w[3]))){
				this.spawned = false;
			}
			if(this.yPos - this.radius > w[2] && this.yPos - this.radius < w[3]
				&& ((this.xPos - this.radius > w[0] && this.xPos - this.radius < w[1]) || (this.xPos + this.radius > w[0] && this.xPos + this.radius < w[1]) || (this.xPos - this.radius < w[0] && this.xPos + this.radius > w[1]))){
				this.spawned = false;
			}
			if(this.yPos + this.radius > w[2] && this.yPos + this.radius < w[3]
				&& ((this.xPos - this.radius > w[0] && this.xPos - this.radius < w[1]) || (this.xPos + this.radius > w[0] && this.xPos + this.radius < w[1]) || (this.xPos - this.radius < w[0] && this.xPos + this.radius > w[1]))){
				this.spawned = false;
			}
		}


		if(this.xPos - this.radius < 0){
			this.spawned = false;
		}
		if(this.xPos + this.radius > mapWidth){
			this.spawned = false;
		}
		if(this.yPos - this.radius < 0){
			this.spawned = false;
		}
		if(this.yPos + this.radius > mapHeight){
			this.spawned = false;
		}
	}

	Bullet.prototype.draw = function(ctx, xCvs, yCvs){
		ctx.save();
		ctx.beginPath();
		ctx.arc(this.xPos - xCvs, this.yPos - yCvs, this.radius, 0, Math.PI*2);
		ctx.fillStyle = "#000000";
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	};

	Bullet.prototype.getSpawned = function(){
		return this.spawned;
	}

	MyGame.Bullet = Bullet;
})();

(function(){
	function Wall(x, y, width, height, color){
		this.width = width || 0;
		this.height = height || 0;
		this.xStart = x || 0;
		this.yStart = y || 0;
		this.xEnd = x + width;
		this.yEnd = y + height;
		this.color = color;
	}

	Wall.prototype.draw = function(ctx){
		ctx.save();
		ctx.beginPath();			        
		ctx.rect (this.xStart, this.yStart, this.width, this.height);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.strokeStyle = "#000000";
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	}

	Wall.prototype.getCoords = function(){
		return [this.xStart, this.xEnd, this.yStart, this.yEnd];
	}

	MyGame.Wall = Wall;
})();

(function(){
	function Map(width, height){
		this.width = width;
		this.height = height;
		this.walls = [];

		this.color = "#00A102"

		this.image = null;
	}

	Map.prototype.generate = function(){
		var ctx = document.createElement("canvas").getContext("2d");
		ctx.canvas.width = this.width;
		ctx.canvas.height = this.height;

		// var imgBg = new Image();
		// imgBg.src = "images/background.png"; /*https://www.toptal.com/designers/subtlepatterns/vintage-concrete*/


		var rows = ~~(this.width/200) + 1;
		var cols = ~~(this.height/200) + 1;

		ctx.save();			
		ctx.fillStyle = this.color;		    
		for (var x = 0, i = 0; i < rows; x+=200, i++) {
			ctx.beginPath();			
			for (var y = 0, j = 0; j < cols; y += 200, j++) {            
				ctx.rect (x, y, 200, 200);				
			}
			ctx.fillStyle = this.color;
			ctx.fill();
			ctx.strokeStyle = "#009002";
			ctx.stroke();
			ctx.closePath();			
		}		
		ctx.restore();

		var WALLS = {
			WIDTH: 20,
			LENGTH: 300,
			DOOR: 100
		}

		/*Array of house coords for floors*/
		var houses = [300,1900];

		/*Houses' Walls - https://www.color-hex.com/color-palette/74708*/
		wallColor = "#977b5f";
		floorColor = "#816346";

		for(var i = 0; i < houses.length; i++){
			for(var j = 0; j < houses.length; j++){
				ctx.save();	    
				ctx.beginPath();          
				ctx.rect (houses[i], houses[j], WALLS.LENGTH + WALLS.WIDTH, WALLS.LENGTH + WALLS.WIDTH);				
				ctx.fillStyle = floorColor;
				ctx.fill();
				ctx.closePath();
				ctx.restore();
			}
		}

		/*Top Left House*/
		this.walls.push(new MyGame.Wall(houses[0] + WALLS.WIDTH, houses[0], WALLS.LENGTH, WALLS.WIDTH, wallColor));					//Top
		this.walls.push(new MyGame.Wall(houses[0], houses[0], WALLS.WIDTH, WALLS.LENGTH - WALLS.DOOR, wallColor));					//Left
		this.walls.push(new MyGame.Wall(houses[0], houses[0] + WALLS.LENGTH, WALLS.LENGTH, WALLS.WIDTH, wallColor));				//Bottom
		this.walls.push(new MyGame.Wall(houses[0] + WALLS.LENGTH, houses[0] + WALLS.WIDTH, WALLS.WIDTH, WALLS.LENGTH, wallColor));	//Right

		/*Top Right House*/
		this.walls.push(new MyGame.Wall(houses[1] + WALLS.WIDTH + WALLS.DOOR, houses[0], WALLS.LENGTH - WALLS.DOOR, WALLS.WIDTH, wallColor));//Top
		this.walls.push(new MyGame.Wall(houses[1], houses[0], WALLS.WIDTH, WALLS.LENGTH, wallColor));								//Left
		this.walls.push(new MyGame.Wall(houses[1], houses[0] + WALLS.LENGTH, WALLS.LENGTH, WALLS.WIDTH, wallColor));				//Bottom
		this.walls.push(new MyGame.Wall(houses[1] + WALLS.LENGTH, houses[0] + WALLS.WIDTH, WALLS.WIDTH, WALLS.LENGTH, wallColor));	//Right

		/*Bottom Left House*/
		this.walls.push(new MyGame.Wall(houses[0] + WALLS.WIDTH, houses[1], WALLS.LENGTH, WALLS.WIDTH, wallColor));					//Top
		this.walls.push(new MyGame.Wall(houses[0], houses[1], WALLS.WIDTH, WALLS.LENGTH, wallColor));								//Left
		this.walls.push(new MyGame.Wall(houses[0], houses[1] + WALLS.LENGTH, WALLS.LENGTH - WALLS.DOOR, WALLS.WIDTH, wallColor));	//Bottom
		this.walls.push(new MyGame.Wall(houses[0] + WALLS.LENGTH, houses[1] + WALLS.WIDTH, WALLS.WIDTH, WALLS.LENGTH, wallColor));	//Right

		/*Bottom Right House*/
		this.walls.push(new MyGame.Wall(houses[1] + WALLS.WIDTH, houses[1], WALLS.LENGTH, WALLS.WIDTH, wallColor));					//Top
		this.walls.push(new MyGame.Wall(houses[1], houses[1], WALLS.WIDTH, WALLS.LENGTH, wallColor));								//Left
		this.walls.push(new MyGame.Wall(houses[1], houses[1] + WALLS.LENGTH, WALLS.LENGTH, WALLS.WIDTH, wallColor));				//Bottom
		this.walls.push(new MyGame.Wall(houses[1] + WALLS.LENGTH, houses[1] + WALLS.WIDTH + WALLS.DOOR, WALLS.WIDTH, WALLS.LENGTH - WALLS.DOOR, wallColor));//Right

		for (var i = 0; i < this.walls.length; i++) {
			this.walls[i].draw(ctx);
		}

		this.image = new Image();
		this.image.src = ctx.canvas.toDataURL("image/jpeg", 0.60);

		ctx = null;
	}

	Map.prototype.draw = function(ctx, xPos, yPos){
		var sx, sy, dx, dy;
		var sWidth, sHeight, dWidth, dHeight;

		sx = xPos;
		sy = yPos;

		sWidth = ctx.canvas.width;
		sHeight = ctx.canvas.height;

		if(this.image.width - sx < sWidth){
			sWidth = this.image.width - sx;
		}
		if(this.image.height - sy < sHeight){
			sHeight = this.image.height - sy;
		}

		dx = 0;
		dy = 0;
		dWidth = sWidth;
		dHeight = sHeight;

		ctx.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
	}

	Map.prototype.getWalls = function(){
		return this.walls;
	}

	MyGame.Map = Map;

})();

(function(){
	/*Game Canvas*/
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");

	var cHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
	canvas.setAttribute("height", 800);
	canvas.setAttribute("width", 900);

	/*Frames Per Second (Refresh)*/
	var fps = 60;
	var interval = 1000/fps;
	var step = interval/1000;

	/*Player and Mouse Coordinates*/
	var xPlayer = canvas.width/2;
	var yPlayer = canvas.height/2;

	/*Player and Bullet Radius*/
	var rPlayer = 40;
	var rBullet = 10;

	MyGame.rBullet = rBullet;

	/*Player and Bullet Speeds*/
	var sBullet = 10000;
	var sPlayer = 400;

	MyGame.sBullet = sBullet;

	/*Initialize Game Map Size*/
	var gameMap = {
		width: 2500,
		height: 2500,
		walls: [],
		map: new MyGame.Map(2500,2500)
	};

	gameMap.map.generate();
	gameMap.walls = gameMap.map.getWalls();

	var player = new MyGame.Player(xPlayer, yPlayer, sPlayer, rPlayer);
	var gun = new MyGame.Gun(xPlayer, yPlayer)

	var camera = new MyGame.Camera(0, 0, canvas.width, canvas.height, gameMap.width, gameMap.height);
	camera.follow(player, canvas.width/2, canvas.height/2);

	canvas.addEventListener("mousemove", aimHandler, false);
	canvas.addEventListener("click", function(e){
		var i;
		var pPos = player.getPos();
		var angle = gun.getAngle();

		xp = pPos[0] + gun.getHeight() * Math.cos(angle + Math.PI/2);	//Bullet xPos
		yp = pPos[1] + gun.getHeight() * Math.sin(angle + Math.PI/2);	//Bullet yPos

		xd = (xp - pPos[0])/cHeight;	//Bullet xDir
		yd = (yp - pPos[1])/cHeight;	//Bullet yDir

		MyGame.bullets[MyGame.bullets.length] = new MyGame.Bullet(xp,yp,xd,yd,sBullet,rBullet);
	}, false);

	var update = function(){
		var dBullet = [];	//Bullet indices to delete
		player.update(step, gameMap.width, gameMap.height, gameMap.walls);
		gun.update(player.xPos, player.yPos, camera.xPos, camera.yPos);
		for(var i = 0; i < MyGame.bullets.length; i++){
			MyGame.bullets[i].update(step, gameMap.width, gameMap.height, gameMap.walls);
			if(!MyGame.bullets[i].getSpawned()){
				dBullet[dBullet.length] = i;
			}
		}
		for(var i = 0; i < dBullet.length; i++){
			MyGame.bullets.splice(dBullet[i] - i, 1);
		}
		camera.update();
	}

	var draw = function(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		gameMap.map.draw(ctx, camera.xPos, camera.yPos);
		player.draw(ctx, camera.xPos, camera.yPos);
		gun.draw(ctx, camera.xPos, camera.yPos);
		for(var i = 0; i < MyGame.bullets.length; i++){
			MyGame.bullets[i].draw(ctx, camera.xPos, camera.yPos);
		}
	}

	var playGame = function(){
		update();
		draw();
	}

	MyGame.play = function(){
		setInterval(function(){playGame();}, interval);
	}
})();

window.addEventListener("keydown", kDownHandler, false);
window.addEventListener("keyup", kUpHandler, false);

function kDownHandler(e) {
    if(e.key == "w" || e.key == "W") {
        MyGame.controls.kW = true;
    }
    if(e.key == "a" || e.key == "A") {
        MyGame.controls.kA = true;
    }
    if(e.key == "s" || e.key == "S") {
        MyGame.controls.kS = true;
    }
    if(e.key == "d" || e.key == "D") {
        MyGame.controls.kD = true;
    }
}

function kUpHandler(e) {
    if(e.key == "w" || e.key == "W") {
        MyGame.controls.kW = false;
    }
    else if(e.key == "a" || e.key == "A") {
        MyGame.controls.kA = false;
    }
    else if(e.key == "s" || e.key == "S") {
        MyGame.controls.kS = false;
    }
    else if(e.key == "d" || e.key == "D") {
        MyGame.controls.kD = false;
    }
}

function aimHandler(e){
	var c = e.target.getBoundingClientRect();
	MyGame.controls.xMouse = Math.floor(e.clientX - c.left);
	MyGame.controls.yMouse = Math.floor(e.clientY - c.top);
}

MyGame.play();
}

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