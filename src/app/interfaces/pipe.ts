import { Param } from "./param";

export interface Pipe {
    name: string;
    description: string;
    params: Param[];
}
