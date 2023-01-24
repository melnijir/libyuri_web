import { Node } from "../interfaces/node";
import { Param } from "../interfaces/param";
import { GraphicLink } from "./graphic-link";

export class GraphPosition {
    x: number = 0;
    y: number = 0;
}

export class GraphicNode implements Node {
    name: string = "";
    class: string = "";
    params: Param[] = [];
    active: boolean = false;
    linksIn: GraphicLink[] = [];
    linksOut: GraphicLink[] = [];
    graphPosition: GraphPosition = {x:0, y:0};
}
