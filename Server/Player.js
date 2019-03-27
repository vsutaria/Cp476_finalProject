export default class Player{
	constructor(x, y, sPlayer, rPlayer){
		this.xPos = x;
		this.yPos = y;

		this.speed = sPlayer;

		this.radius = rPlayer;
	}

	update(step, mapWidth, mapHeight, walls){
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

	draw(ctx, xCvs, yCvs){
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

	getPos(){
		return [~~(this.xPos/1), ~~(this.yPos/1)];
	}
}