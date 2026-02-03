import { Pin } from "./pin";
import { Point } from "./point";

export interface Component {
  id: string;
  type: string;
  position: Point; // Top left
  pins: Pin[];
  bounds: {
    width: number;
    height: number;
  }
}