module.exports = class Bullet{
	constructor(xp, yp, xd, yd, sBullet, rBullet){
		this.xPos = xp;
		this.yPos = yp;

		this.xDir = xd;
		this.yDir = yd

		this.speed = sBullet;
		this.radius = rBullet;

		this.spawned = true;

		this.damage = 10;
	}

	update(step, mapWidth, mapHeight, walls, state){
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

		for (var id in state) {
			var w = [state[id].player.xPos - state[id].player.radius, state[id].player.xPos + state[id].player.radius, state[id].player.yPos - state[id].player.radius, state[id].player.yPos + state[id].player.radius];
			if(this.xPos - this.radius > w[0] && this.xPos - this.radius < w[1]
				&& ((this.yPos - this.radius > w[2] && this.yPos - this.radius < w[3]) || (this.yPos + this.radius > w[2] && this.yPos + this.radius < w[3]) || (this.yPos - this.radius < w[2] && this.yPos + this.radius > w[3]))) {
				this.spawned = false;
				state[id].player.subHP(this.damage);
			}
			else if(this.xPos + this.radius > w[0] && this.xPos + this.radius < w[1]
				&& ((this.yPos - this.radius > w[2] && this.yPos - this.radius < w[3]) || (this.yPos + this.radius > w[2] && this.yPos + this.radius < w[3]) || (this.yPos - this.radius < w[2] && this.yPos + this.radius > w[3]))){
				this.spawned = false;
				state[id].player.subHP(this.damage);
			}
			else if(this.yPos - this.radius > w[2] && this.yPos - this.radius < w[3]
				&& ((this.xPos - this.radius > w[0] && this.xPos - this.radius < w[1]) || (this.xPos + this.radius > w[0] && this.xPos + this.radius < w[1]) || (this.xPos - this.radius < w[0] && this.xPos + this.radius > w[1]))){
				this.spawned = false;
				state[id].player.subHP(this.damage);
			}
			else if(this.yPos + this.radius > w[2] && this.yPos + this.radius < w[3]
				&& ((this.xPos - this.radius > w[0] && this.xPos - this.radius < w[1]) || (this.xPos + this.radius > w[0] && this.xPos + this.radius < w[1]) || (this.xPos - this.radius < w[0] && this.xPos + this.radius > w[1]))){
				this.spawned = false;
				state[id].player.subHP(this.damage);
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

	draw(ctx, xCvs, yCvs){
		ctx.save();
		ctx.beginPath();
		ctx.arc(this.xPos - xCvs, this.yPos - yCvs, this.radius, 0, Math.PI*2);
		ctx.fillStyle = "#000000";
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}

	getSpawned(){
		return this.spawned;
	}
}