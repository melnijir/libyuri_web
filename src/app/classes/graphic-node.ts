import { Node } from "../interfaces/node";
import { Param } from "../interfaces/param";

export class GraphPosition {
    x: number = 0;
    y: number = 0;
}

export class GraphicNode implements Node {
    name: string = "";
    class: string = "";
    params: Param[] = [];
    active: boolean = false;
    graphPosition: GraphPosition = {x:0, y:0};
}
