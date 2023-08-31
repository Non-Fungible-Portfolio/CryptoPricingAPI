import { z } from "zod"

// Success response base type
export interface SuccessResponse{
    success: true,
    data: Record<any, any> | Array<any> 
}

export const SuccessResponseZod = z.object({
    success: z.literal(true),
    data: z.record(z.any(), z.any()).or(z.any().array())
}) satisfies z.ZodType<SuccessResponse>;

// Error response base type
export interface ErrorResponse{
    success: false,
    error: {
        name: string,
        message: string,
        trace?: string
    }
}

export const ErrorResponseZod = z.object({
    success: z.literal(false),
    error: z.object({
        name: z.string(),
        message: z.string(),
        trace: z.string().optional()
    })
}) satisfies z.ZodType<ErrorResponse>;

// Now, finalized base type representing both possible responses
export type ResponseType = SuccessResponse | ErrorResponse;

export const ResponseTypeZod = ErrorResponseZod.or(SuccessResponseZod);

/*
Per-path responses below
*/

export interface GetPriceResponse extends SuccessResponse {
    data: {
        timestamp: number,
        value: number,
        volume: number
    }
}

export const GetPriceResponseZod = SuccessResponseZod.extend({
    data: z.object({
        timestamp: z.number(),
        value: z.number(),
        volume: z.number()
    })
}) satisfies z.ZodType<GetPriceResponse>;