const Wall = require('./Wall.js');
const Canvas = require('canvas');

module.exports = class GameMap{
	constructor(width, height){
		this.width = width;
		this.height = height;
		this.walls = [];

		this.color = "#00A102"

		this.canvas = null;

		this.image = null;
		this.imageSrc = null;
	}

	generate(){
		/*var canvas = createCanvas(dia, dia);*/
		this.canvas = Canvas.createCanvas(900,800);
		var ctx = this.canvas.getContext("2d");
		ctx.canvas.width = this.width;
		ctx.canvas.height = this.height;

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
		var wallColor = "#977b5f";
		var floorColor = "#816346";

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
		this.walls.push(new Wall(houses[0] + WALLS.WIDTH, houses[0], WALLS.LENGTH, WALLS.WIDTH, wallColor));					//Top
		this.walls.push(new Wall(houses[0], houses[0], WALLS.WIDTH, WALLS.LENGTH - WALLS.DOOR, wallColor));					//Left
		this.walls.push(new Wall(houses[0], houses[0] + WALLS.LENGTH, WALLS.LENGTH, WALLS.WIDTH, wallColor));				//Bottom
		this.walls.push(new Wall(houses[0] + WALLS.LENGTH, houses[0] + WALLS.WIDTH, WALLS.WIDTH, WALLS.LENGTH, wallColor));	//Right

		/*Top Right House*/
		this.walls.push(new Wall(houses[1] + WALLS.WIDTH + WALLS.DOOR, houses[0], WALLS.LENGTH - WALLS.DOOR, WALLS.WIDTH, wallColor));//Top
		this.walls.push(new Wall(houses[1], houses[0], WALLS.WIDTH, WALLS.LENGTH, wallColor));								//Left
		this.walls.push(new Wall(houses[1], houses[0] + WALLS.LENGTH, WALLS.LENGTH, WALLS.WIDTH, wallColor));				//Bottom
		this.walls.push(new Wall(houses[1] + WALLS.LENGTH, houses[0] + WALLS.WIDTH, WALLS.WIDTH, WALLS.LENGTH, wallColor));	//Right

		/*Bottom Left House*/
		this.walls.push(new Wall(houses[0] + WALLS.WIDTH, houses[1], WALLS.LENGTH, WALLS.WIDTH, wallColor));					//Top
		this.walls.push(new Wall(houses[0], houses[1], WALLS.WIDTH, WALLS.LENGTH, wallColor));								//Left
		this.walls.push(new Wall(houses[0], houses[1] + WALLS.LENGTH, WALLS.LENGTH - WALLS.DOOR, WALLS.WIDTH, wallColor));	//Bottom
		this.walls.push(new Wall(houses[0] + WALLS.LENGTH, houses[1] + WALLS.WIDTH, WALLS.WIDTH, WALLS.LENGTH, wallColor));	//Right

		/*Bottom Right House*/
		this.walls.push(new Wall(houses[1] + WALLS.WIDTH, houses[1], WALLS.LENGTH, WALLS.WIDTH, wallColor));					//Top
		this.walls.push(new Wall(houses[1], houses[1], WALLS.WIDTH, WALLS.LENGTH, wallColor));								//Left
		this.walls.push(new Wall(houses[1], houses[1] + WALLS.LENGTH, WALLS.LENGTH, WALLS.WIDTH, wallColor));				//Bottom
		this.walls.push(new Wall(houses[1] + WALLS.LENGTH, houses[1] + WALLS.WIDTH + WALLS.DOOR, WALLS.WIDTH, WALLS.LENGTH - WALLS.DOOR, wallColor));//Right

		for (var i = 0; i < this.walls.length; i++) {
			this.walls[i].draw(ctx);
		}

		this.image = new Canvas.Image();
		this.image.src = ctx.canvas.toDataURL("image/png");
		this.imageSrc = this.image.src;

		ctx = null;
	}

	draw(ctx, xPos, yPos){
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

	getWalls(){
		return this.walls;
	}
}