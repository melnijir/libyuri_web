import { Param } from "./param";

export interface Node {
    name: string;
    class: string;
    params: Param[];
}
