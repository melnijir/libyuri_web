import { Param } from "./param";

export interface Pipe {
    name: string;
    class: string;
    params: Param[];
}
