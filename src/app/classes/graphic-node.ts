import { Node } from "../interfaces/node";
import { Param } from "../interfaces/param";
import { GraphicLink } from "./graphic-link";

export class GraphicNode implements Node {
    name: string = "";
    class: string = "";
    params: Param[] = [];
    active: boolean = false;
    links: GraphicLink[] = [];
}
