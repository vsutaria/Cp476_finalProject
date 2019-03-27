export default class Gun{
	constructor(x, y){
		this.xPos = x;
		this.yPos = y;

		this.width = 10;
		this.height = 80;

		this.angle = 0;
	}

	update(x, y, xCvs, yCvs){
		this.xPos = x;
		this.yPos = y;

		this.angle = Math.atan(~~((MyGame.controls.yMouse - (this.yPos - yCvs))/1) / ~~((MyGame.controls.xMouse - (this.xPos - xCvs))/1)) + (Math.PI/2);

		if(~~((MyGame.controls.xMouse - (this.xPos - xCvs))/1) >= 0){
			this.angle += Math.PI;
		}
	}

	draw(ctx, xCvs, yCvs){
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
	}

	getHeight(){
		return this.height;
	}

	getAngle(){
		return this.angle;
	}
}