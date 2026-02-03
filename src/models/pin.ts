import type { Point } from './point';

export enum PinType {
	INPUT = 'input',
	OUTPUT = 'output',
}

export enum PinOrientation {
	RIGHT = 0, // Pin points right
	DOWN = 90, // Pin points down
	LEFT = 180, // Pin points left
	UP = 270 // Pin points up
}

export interface Pin {
	id: string;
	name: string;
	number: string;
	type: PinType;
	position: Point; // Relative to component position
	orientation: PinOrientation;
}

