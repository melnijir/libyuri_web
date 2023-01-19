import { Node } from "../interfaces/node";
import { Param } from "../interfaces/param";

export class GraphicNode implements Node {
    name: string = "";
    class: string = "";
    params: Param[] = [];
    active: boolean = false;
    pipes: number = 0;
}
