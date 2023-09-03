import { Logger } from "Logger";
import { RequestPayload } from "../definitions/RequestTypes";
import { ErrorResponse, ResponseType } from "../definitions/ResponseTypes";

export function forwardCall<T extends RequestPayload, R extends ResponseType>(functionCall: (request: T) => Promise<R>): (response: any) => Promise<ErrorResponse | R>{
    return async (response: any) => {
        try{
            return await functionCall(response as T)
        }catch(err) {
            // Log the error
            Logger.getLogger()?.error(err);

            // Return a failure object as response
            const error = err as Error;
            
            return {
                success: false,
                error: {
                    name: error.name,
                    stack: error.stack ?? "No found stack",
                    message: error.message
                }
            } as ErrorResponse;
        }
    };
}