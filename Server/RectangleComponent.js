export default class RectangleComponent{
	constructor(x, y,width, height){
		this.width = width || 0;
		this.height = height || 0;
		this.xStart = x || 0;
		this.yStart = y || 0;
		this.xEnd = x + width;
		this.yEnd = y + height;
	}

	set(x, y, width, height){
		this.width = width || this.width;
		this.height = height || this.height;
		this.xStart = x || this.xStart;
		this.yStart = y || this.yStart;
		this.xEnd = this.xStart + this.width;
		this.yEnd = this.yStart + this.height;
	}

	inside(m){
		return (m.xStart <= this.xStart && m.xEnd >= this.xEnd &&
			m.yStart <= this.yStart && m.yEnd >= this.yEnd);
	}

	cover(m){
		return(this.xStart < m.xEnd && m.xStart < this.xEnd &&
			this.yStart < m.yEnd && m.yStart < this.yEnd);
	}
}