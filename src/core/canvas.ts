export class Canvas {
	private ctx: CanvasRenderingContext2D;
	private width: number;
	private height: number;

	constructor(private canvasElement: HTMLCanvasElement) {
		const ctx = canvasElement.getContext('2d');
		if (!ctx) {
			throw new Error('Failed to get 2D context');
		}
		this.ctx = ctx;
		this.width = canvasElement.width;
		this.height = canvasElement.height;

		this.setupHighDPI();
	}

	private setupHighDPI() {
		const dpr = window.devicePixelRatio || 1;
		const rect = this.canvasElement.getBoundingClientRect();

		// Prevent compounding scale() calls when resize() is invoked repeatedly.
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);

		this.canvasElement.width = rect.width * dpr;
		this.canvasElement.height = rect.height * dpr;

		this.ctx.scale(dpr, dpr);

		this.canvasElement.style.width = `${rect.width}px`;
		this.canvasElement.style.height = `${rect.height}px`;

		this.width = rect.width;
		this.height = rect.height;
	}

	getContext(): CanvasRenderingContext2D {
		return this.ctx;
	}

	getWidth(): number {
		return this.width;
	}

	getHeight(): number {
		return this.height;
	}

	getElement(): HTMLCanvasElement {
		return this.canvasElement;
	}

	clear() {
		this.ctx.clearRect(0, 0, this.width, this.height);
	}

	resize() {
		this.setupHighDPI();
	}
}
