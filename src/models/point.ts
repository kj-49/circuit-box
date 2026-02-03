export interface Point {
	x: number;
	y: number;
}

export function distance(p1: Point, p2: Point): number {
	const dx = p2.x - p1.x;
	const dy = p2.y - p1.y;
	return Math.sqrt(dx * dx + dy * dy);
}

export function snapToGrid(point: Point, gridSize: number): Point {
	return {
		x: Math.round(point.x / gridSize) * gridSize,
		y: Math.round(point.y / gridSize) * gridSize
	};
}

export function add(p1: Point, p2: Point): Point {
	return { x: p1.x + p2.x, y: p1.y + p2.y };
}

export function subtract(p1: Point, p2: Point): Point {
	return { x: p1.x - p2.x, y: p1.y - p2.y };
}
