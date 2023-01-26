import { Graph } from "../interfaces/graph";
import { GraphicLink } from "./graphic-link";
import { GraphicNode } from "./graphic-node";

export class GraphicGraph implements Graph {
    nodes: GraphicNode[] = [];
    links: GraphicLink[] = [];
}
