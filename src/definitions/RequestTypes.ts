import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export interface RequestPayload {
    ctx: {
        req: FastifyRequest,
        res: FastifyReply,
    },
    input: unknown
}

export interface GetPriceRequest extends RequestPayload {
    input: {
        asset: "ethereum",
        timestamp: number
    }
}