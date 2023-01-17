export interface Class {
    name: string;
    description: string;
    params: Param[];
}

export interface Param {
    name: string;
    description: string;
    value: string;
}
