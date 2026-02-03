import { Wire } from "./wire";

export interface Net {
	id: string;
	name: string;
	wires: Wire[];
	connectedPins: Array<{ componentId: string; pinId: string }>;
}