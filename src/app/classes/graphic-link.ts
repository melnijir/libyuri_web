import { Param } from "../interfaces/param";
import { Link } from "../interfaces/link";
import { GraphicNode } from "./graphic-node";

export class GraphicLink implements Link {
    name: string = "";
    class: string = "single";
    params: Param[] = [];
    src: string = "";
    dst: string = "";
    from?: GraphicNode;
    to?: GraphicNode;
    from_native?: any;
    to_native?: any;
    from_index: number = 0;
    to_index: number = 0;
    line?: any;
    fresh: boolean = true;
}
