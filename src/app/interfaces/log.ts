import { Message } from "./message";

export interface Log extends Message {
    log: string[];
}
