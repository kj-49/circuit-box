import type { Point } from './point';

export interface Wire {
	id: string;
	start: Point;
	end: Point;
	netId: string | null; // Which net this wire belongs to
}