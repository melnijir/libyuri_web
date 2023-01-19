import { Param } from "../interfaces/param";
import { Pipe } from "../interfaces/pipe";
import { GraphicNode } from "./graphic-node";

export class GraphicPipe implements Pipe{
    name: string = "";
    class: string = "";
    params: Param[] = [];
    from?: GraphicNode;
    to?: GraphicNode;
    from_native?: any;
    to_native?: any;
    line?: any;
}
