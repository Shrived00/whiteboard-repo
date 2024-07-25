export interface Element {
    id: number;
    type: "rect" | "pencil" | "line";
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
    path: Array<[number, number]>;
    stroke: string;
}
