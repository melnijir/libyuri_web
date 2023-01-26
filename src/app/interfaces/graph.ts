import { Node } from "./node";
import { Link } from "./link";

export interface Graph {
    nodes: Node[];
    links: Link[];
}
