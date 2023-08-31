import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import { createContext } from '../routes/RouteContext';
import { appRouter } from '../routes/RouteHandler';

const server = fastify({
  maxParamLength: 5000,
});

server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: { router: appRouter, createContext },
});

(async () => {
  try {
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();