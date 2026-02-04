import type { Point } from '../models/point';

export class Grid {
	constructor(
		private spacing: number = 100, // 100 millimeters
		private majorGridInterval: number = 5 // Major grid every 5 lines
	) {}

	snap(point: Point): Point {
		return {
			x: Math.round(point.x / this.spacing) * this.spacing,
			y: Math.round(point.y / this.spacing) * this.spacing
		};
	}

	getSpacing(): number {
		return this.spacing;
	}

	setSpacing(spacing: number) {
		this.spacing = spacing;
	}

	getMajorGridInterval(): number {
		return this.majorGridInterval;
	}

	setMajorGridInterval(interval: number) {
		this.majorGridInterval = interval;
	}

	isOnGrid(point: Point, tolerance = 0.1): boolean {
		const snapped = this.snap(point);
		return Math.abs(point.x - snapped.x) < tolerance && Math.abs(point.y - snapped.y) < tolerance;
	}

	getNearestGridPoint(point: Point): Point {
		return this.snap(point);
	}

  getGridLinesInBounds(bounds: {
		x: number;
		y: number;
		width: number;
		height: number;
	}): { vertical: number[]; horizontal: number[] } {
		const vertical: number[] = [];
		const horizontal: number[] = [];

		const startX = Math.floor(bounds.x / this.spacing) * this.spacing;
		const endX = Math.ceil((bounds.x + bounds.width) / this.spacing) * this.spacing;
		const startY = Math.floor(bounds.y / this.spacing) * this.spacing;
		const endY = Math.ceil((bounds.y + bounds.height) / this.spacing) * this.spacing;

		for (let x = startX; x <= endX; x += this.spacing) {
			vertical.push(x);
		}

		for (let y = startY; y <= endY; y += this.spacing) {
			horizontal.push(y);
		}

		return { vertical, horizontal };
	}
}
