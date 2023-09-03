import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify, { FastifyInstance } from 'fastify';
import { createContext } from '../routes/RouteContext';
import { appRouter } from '../routes/RouteHandler';
import { Logger } from 'Logger';
import { procedureTypes } from '@trpc/server';
import { log } from '../utils/Log';

interface AddressInfo {
    port: number,
    address: string
}

export class HTTPServer {
    private server: FastifyInstance | undefined;

    async start(){
        log("SERVER BOOT", "Starting fastify instance", "info");
        this.server = fastify({
            maxParamLength: 5000
        })
        log("SERVER BOOT", "Fastify instance started. Registering plugins...", "info");

        // Register plugins
        this.registerServerPlugins();
        log("SERVER BOOT", "Fastify plugins registered. Binding to port...", "info");

        // Start the server
        try{
            await this.server.listen({
                port: parseInt(process.env.HTTP_PORT ?? "9999")
            });
            const addressInfo = this.server.server.address() as AddressInfo;
            log("SERVER BOOT", `Binded to port: ${addressInfo.port} and IP: ${addressInfo.address}`, "info");
            log("SERVER BOOT", "Server started successfully", "info");
        }catch(error: any){
            log("SERVER BOOT", `${(error as Error).message} - ${(error as Error).stack ?? ""}`, "error");
            process.exit(1);
        }
    }

    private registerServerPlugins(){
        if(this.server == null) return;

        // Register helmet
        log("PLUGIN REGISTRATION", "Registering Helmet", "info");

        // Register tRPC
        log("PLUGIN REGISTRATION", "Registering tRPC", "info");
        this.server.register(fastifyTRPCPlugin, {
            prefix: "/api",
            trpcOptions: {
                router: appRouter,
                createContext: createContext
            }
        })
    }
}