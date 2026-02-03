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

	isOnGrid(point: Point, tolerance = 0.1): boolean {
		const snapped = this.snap(point);
		return Math.abs(point.x - snapped.x) < tolerance && Math.abs(point.y - snapped.y) < tolerance;
	}

	getNearestGridPoint(point: Point): Point {
		return this.snap(point);
	}
}
