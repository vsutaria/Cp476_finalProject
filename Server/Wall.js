export default class Player{
	constructor(x, y, width, height, color){
		this.width = width || 0;
		this.height = height || 0;
		this.xStart = x || 0;
		this.yStart = y || 0;
		this.xEnd = x + width;
		this.yEnd = y + height;
		this.color = color;
	}

	draw(ctx){
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

	getCoords(){
		return [this.xStart, this.xEnd, this.yStart, this.yEnd];
	}
}