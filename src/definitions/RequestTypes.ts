import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export interface RequestPayload {
    ctx: {
        req: FastifyRequest,
        res: FastifyReply,
    },
    input: unknown
}

// Route definitions for api/getPrice
export interface GetPriceRequest {
    asset: "ethereum",
    timestamp: number
}

export const GetPriceRequestZod = z.object({
    asset: z.enum(["ethereum"]),
    timestamp: z.number()
}) satisfies z.ZodType<GetPriceRequest>;

export interface GetPricePayload extends RequestPayload {
    input: GetPriceRequest
}