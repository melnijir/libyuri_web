import { Param } from "../interfaces/param";
import { Link } from "../interfaces/link";
import { GraphicNode } from "./graphic-node";

export class GraphicLink implements Link {
    name: string = "";
    class: string = "";
    params: Param[] = [];
    from?: GraphicNode;
    to?: GraphicNode;
    from_native?: any;
    to_native?: any;
    line?: any;
}
