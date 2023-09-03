import { Logger } from "Logger";

export function log(stage: string, message: string, level: "info" | "error" | "warn"){
    if(Logger.getLogger() == null) return;

    // Access the desired logging level by accessing the class as an object
    // @ts-ignore
    Logger["getLogger"]()[level](`[${stage}] ${message}`);
}