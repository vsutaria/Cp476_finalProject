const RectangleComponent = require('./RectangleComponent.js').default;
var DIR = {
	NONE: "none",
	HORIZONTAL: "horizontal",
	VERTICAL: "vertical",
	BOTH: "both"
}

module.exports = class Camera{

	constructor(xPos, yPos, cvsWidth, cvsHeight, mapWidth, mapHeight){
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
		this.vpRect = new RectangleComponent(this.xPos, this.yPos, this.cvsWidth, this.cvsHeight);

		/*Map Rectangle*/
		this.mapRect = new RectangleComponent(0, 0, mapWidth, mapHeight);
	}

	follow(playerObj, xWall, yWall){
		this.following = playerObj;
		this.xWall = xWall;
		this.yWall = yWall;
	}

	update(){
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
}