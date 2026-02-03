import type { Canvas } from './canvas';
import type { Point } from '../models/point';

export class Viewport {
	private offsetX = 0;
	private offsetY = 0;
	private zoom = 1.0;
	private minZoom = 0.1;
	private maxZoom = 10;

	constructor(private canvas: Canvas) {}

	pan(dx: number, dy: number) {
		this.offsetX += dx / this.zoom;
		this.offsetY += dy / this.zoom;
	}

	setOffset(x: number, y: number) {
		this.offsetX = x;
		this.offsetY = y;
	}

	zoomAt(worldX: number, worldY: number, delta: number) {
		const oldZoom = this.zoom;
		this.zoom *= Math.exp(delta * 0.001);
		this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom));

		// Zoom towards point (keep point under cursor)
		const zoomRatio = this.zoom / oldZoom;
		this.offsetX = worldX - (worldX - this.offsetX) * zoomRatio;
		this.offsetY = worldY - (worldY - this.offsetY) * zoomRatio;
	}

	setZoom(zoom: number) {
		this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
	}

	screenToWorld(screenX: number, screenY: number): Point {
		return {
			x: screenX / this.zoom + this.offsetX,
			y: screenY / this.zoom + this.offsetY
		};
	}

	worldToScreen(worldX: number, worldY: number): Point {
		return {
			x: (worldX - this.offsetX) * this.zoom,
			y: (worldY - this.offsetY) * this.zoom
		};
	}

	getZoom(): number {
		return this.zoom;
	}

	getOffset(): Point {
		return { x: this.offsetX, y: this.offsetY };
	}

	getVisibleWorldBounds(): { x: number; y: number; width: number; height: number } {
		const topLeft = this.screenToWorld(0, 0);
		const bottomRight = this.screenToWorld(this.canvas.getWidth(), this.canvas.getHeight());

		return {
			x: topLeft.x,
			y: topLeft.y,
			width: bottomRight.x - topLeft.x,
			height: bottomRight.y - topLeft.y
		};
	}

	reset() {
		this.offsetX = 0;
		this.offsetY = 0;
		this.zoom = 1.0;
	}
}
