import { Param } from "./param";

export interface Link {
    name: string;
    class: string;
    src: string;
    dst: string;
    params: Param[];
}
