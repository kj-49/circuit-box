import { Canvas } from '../core/canvas';
import { Grid } from '../core/grid';
import { Viewport } from '../core/viewport';
import { GridRenderer, type GridRendererStyle } from '../rendering/grid-renderer';

export type CreateCircuitContainer = HTMLElement | string;

export type CreateCircuitOptions = {
	canvas?: {
		className?: string;
		backgroundColor?: string;
	};
	grid?: {
		spacing?: number;
		majorInterval?: number;
		style?: GridRendererStyle;
	};
	viewport?: {
		offset?: { x: number; y: number };
		zoom?: number;
	};
	interaction?: {
		pan?: boolean;
		zoom?: boolean;
		invertWheel?: boolean;
	};
};

export type CircuitHandle = {
	container: HTMLElement;
	canvasElement: HTMLCanvasElement;
	canvas: Canvas;
	viewport: Viewport;
	grid: Grid;
	gridRenderer: GridRenderer;

	resize: () => void;
	renderOnce: () => void;
	destroy: () => void;
};

function resolveContainer(container: CreateCircuitContainer): HTMLElement {
	if (typeof container === 'string') {
		const el = document.querySelector(container);
		if (!el) {
			throw new Error(`createCircuit: container not found for selector: ${container}`);
		}
		if (!(el instanceof HTMLElement)) {
			throw new Error('createCircuit: selector did not resolve to an HTMLElement');
		}
		return el;
	}

	return container;
}

export function createCircuit(
	containerInput: CreateCircuitContainer,
	options: CreateCircuitOptions = {}
): CircuitHandle {
	const container = resolveContainer(containerInput);

	const canvasElement = document.createElement('canvas');
	canvasElement.style.width = '100%';
	canvasElement.style.height = '100%';
	canvasElement.style.display = 'block';
	canvasElement.className = options.canvas?.className ?? '';
	container.appendChild(canvasElement);

	const canvas = new Canvas(canvasElement);
	const viewport = new Viewport(canvas);
	const grid = new Grid(
		options.grid?.spacing ?? 100,
		options.grid?.majorInterval ?? 5
	);
	const gridRenderer = new GridRenderer(canvas, viewport, grid, options.grid?.style ?? {});

	if (options.viewport?.offset) {
		viewport.setOffset(options.viewport.offset.x, options.viewport.offset.y);
	}
	if (typeof options.viewport?.zoom === 'number') {
		viewport.setZoom(options.viewport.zoom);
	}

	const ctx = canvas.getContext();
	const backgroundColor = options.canvas?.backgroundColor ?? '#ffffff';

	let rafId = 0;
	let destroyed = false;

	const renderOnce = () => {
		if (destroyed) return;
		canvas.clear();
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0, 0, canvas.getWidth(), canvas.getHeight());
		gridRenderer.render();
	};

	const renderLoop = () => {
		renderOnce();
		rafId = requestAnimationFrame(renderLoop);
	};

	// Interaction
	const enablePan = options.interaction?.pan ?? true;
	const enableZoom = options.interaction?.zoom ?? true;
	const invertWheel = options.interaction?.invertWheel ?? false;

	let dragging = false;
	let lastX = 0;
	let lastY = 0;

	const onWheel = (e: WheelEvent) => {
		if (!enableZoom) return;
		e.preventDefault();

		const rect = canvasElement.getBoundingClientRect();
		const sx = e.clientX - rect.left;
		const sy = e.clientY - rect.top;
		const world = viewport.screenToWorld(sx, sy);

		const delta = invertWheel ? e.deltaY : -e.deltaY;
		viewport.zoomAt(world.x, world.y, delta);
	};

	const onPointerDown = (e: PointerEvent) => {
		if (!enablePan) return;
		dragging = true;
		lastX = e.clientX;
		lastY = e.clientY;
		canvasElement.setPointerCapture(e.pointerId);
	};

	const onPointerMove = (e: PointerEvent) => {
		if (!enablePan || !dragging) return;
		const dx = e.clientX - lastX;
		const dy = e.clientY - lastY;
		lastX = e.clientX;
		lastY = e.clientY;

		viewport.pan(-dx, -dy);
	};

	const onPointerUp = () => {
		dragging = false;
	};

	canvasElement.addEventListener('wheel', onWheel, { passive: false });
	canvasElement.addEventListener('pointerdown', onPointerDown);
	canvasElement.addEventListener('pointermove', onPointerMove);
	window.addEventListener('pointerup', onPointerUp);

	// Resize handling
	const resize = () => {
		canvas.resize();
	};

	const resizeObserver = new ResizeObserver(() => resize());
	resizeObserver.observe(container);

	// Start rendering
	renderLoop();

	const destroy = () => {
		if (destroyed) return;
		destroyed = true;

		cancelAnimationFrame(rafId);
		resizeObserver.disconnect();

		canvasElement.removeEventListener('wheel', onWheel);
		canvasElement.removeEventListener('pointerdown', onPointerDown);
		canvasElement.removeEventListener('pointermove', onPointerMove);
		window.removeEventListener('pointerup', onPointerUp);

		canvasElement.remove();
	};

	return {
		container,
		canvasElement,
		canvas,
		viewport,
		grid,
		gridRenderer,
		resize,
		renderOnce,
		destroy
	};
}
