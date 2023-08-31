import { FastifyReply, FastifyRequest } from "fastify";

export interface RequestPayload {
    req: FastifyRequest,
    res: FastifyReply,
    body?: unknown,
    query?: 
}