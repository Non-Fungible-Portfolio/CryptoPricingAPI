import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify, { FastifyInstance } from 'fastify';
import { createContext } from '../routes/RouteContext';
import { appRouter } from '../routes/RouteHandler';
import { Logger } from 'Logger';
import { procedureTypes } from '@trpc/server';

interface AddressInfo {
    port: number,
    address: string
}

export class HTTPServer {
    private server: FastifyInstance | undefined;

    async start(){
        this.log("SERVER BOOT", "Starting fastify instance", "info");
        this.server = fastify({
            maxParamLength: 5000
        })
        this.log("SERVER BOOT", "Fastify instance started. Registering plugins...", "info");

        // Register plugins
        this.registerServerPlugins();
        this.log("SERVER BOOT", "Fastify plugins registered. Binding to port...", "info");

        // Start the server
        try{
            await this.server.listen({
                port: /*process.env.HTTP_PORT*/ 3000
            });
            const addressInfo = this.server.server.address() as AddressInfo;
            this.log("SERVER BOOT", `Binded to port: ${addressInfo.port} and IP: ${addressInfo.address}`, "info");
            this.log("SERVER BOOT", "Server started successfully", "info");
        }catch(error: any){
            this.log("SERVER BOOT", `${(error as Error).message} - ${(error as Error).stack ?? ""}`, "error");
            process.exit(1);
        }
    }

    private log(stage: string, message: string, level: "info" | "error" | "warn"){
        if(Logger.getLogger() == null) return;

        // Access the desired logging level by accessing the class as an object
        // @ts-ignore
        Logger["getLogger"]()[level](`[${stage}] ${message}`);
    }

    private registerServerPlugins(){
        if(this.server == null) return;

        // Register helmet
        this.log("PLUGIN REGISTRATION", "Registering Helmet", "info");

        // Register tRPC
        this.log("PLUGIN REGISTRATION", "Registering tRPC", "info");
        this.server.register(fastifyTRPCPlugin, {
            prefix: "/api",
            trpcOptions: {
                router: appRouter,
                createContext: createContext
            }
        })
    }
}