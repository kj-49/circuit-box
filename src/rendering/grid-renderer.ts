import type { Canvas } from '../core/canvas';
import type { Viewport } from '../core/viewport';
import type { Grid } from '../core/grid';

export type GridRendererStyle = {
	minorLineColor?: string;
	majorLineColor?: string;
	originColor?: string;
	minorLineWidth?: number;
	majorLineWidth?: number;
	originLineWidth?: number;
};

export class GridRenderer {
	constructor(
		private canvas: Canvas,
		private viewport: Viewport,
		private grid: Grid,
		private style: GridRendererStyle = {}
	) {}

	setStyle(style: GridRendererStyle) {
		this.style = style;
	}

	render() {
		const ctx = this.canvas.getContext();
		const bounds = this.viewport.getVisibleWorldBounds();
		const zoom = this.viewport.getZoom();

		// Don't draw grid if zoomed out too far
		if (zoom < 0.1) return;

		const { vertical, horizontal } = this.grid.getGridLinesInBounds(bounds);
		const spacing = this.grid.getSpacing();
		const majorInterval = this.grid.getMajorGridInterval();

		ctx.save();

		const minorLineColor = this.style.minorLineColor ?? 'rgba(200, 200, 200, 0.3)';
		const majorLineColor = this.style.majorLineColor ?? 'rgba(150, 150, 150, 0.5)';
		const originColor = this.style.originColor ?? 'rgba(255, 0, 0, 0.5)';
		const minorLineWidth = this.style.minorLineWidth ?? 1;
		const majorLineWidth = this.style.majorLineWidth ?? 1;
		const originLineWidth = this.style.originLineWidth ?? 2;

		// Draw minor grid lines
		ctx.strokeStyle = minorLineColor;
		ctx.lineWidth = minorLineWidth;

		vertical.forEach((x) => {
			const gridIndex = Math.round(x / spacing);
			const isMajor = gridIndex % majorInterval === 0;
			if (!isMajor) {
				const screenPos = this.viewport.worldToScreen(x, 0);
				ctx.beginPath();
				ctx.moveTo(screenPos.x, 0);
				ctx.lineTo(screenPos.x, this.canvas.getHeight());
				ctx.stroke();
			}
		});

		horizontal.forEach((y) => {
			const gridIndex = Math.round(y / spacing);
			const isMajor = gridIndex % majorInterval === 0;
			if (!isMajor) {
				const screenPos = this.viewport.worldToScreen(0, y);
				ctx.beginPath();
				ctx.moveTo(0, screenPos.y);
				ctx.lineTo(this.canvas.getWidth(), screenPos.y);
				ctx.stroke();
			}
		});

		// Draw major grid lines
		ctx.strokeStyle = majorLineColor;
		ctx.lineWidth = majorLineWidth;

		vertical.forEach((x) => {
			const gridIndex = Math.round(x / spacing);
			const isMajor = gridIndex % majorInterval === 0;
			if (isMajor) {
				const screenPos = this.viewport.worldToScreen(x, 0);
				ctx.beginPath();
				ctx.moveTo(screenPos.x, 0);
				ctx.lineTo(screenPos.x, this.canvas.getHeight());
				ctx.stroke();
			}
		});

		horizontal.forEach((y) => {
			const gridIndex = Math.round(y / spacing);
			const isMajor = gridIndex % majorInterval === 0;
			if (isMajor) {
				const screenPos = this.viewport.worldToScreen(0, y);
				ctx.beginPath();
				ctx.moveTo(0, screenPos.y);
				ctx.lineTo(this.canvas.getWidth(), screenPos.y);
				ctx.stroke();
			}
		});

		// Draw origin
		const origin = this.viewport.worldToScreen(0, 0);
		ctx.strokeStyle = originColor;
		ctx.lineWidth = originLineWidth;

		// Crosshair at origin
		ctx.beginPath();
		ctx.moveTo(origin.x - 10, origin.y);
		ctx.lineTo(origin.x + 10, origin.y);
		ctx.moveTo(origin.x, origin.y - 10);
		ctx.lineTo(origin.x, origin.y + 10);
		ctx.stroke();

		ctx.restore();
	}
}
