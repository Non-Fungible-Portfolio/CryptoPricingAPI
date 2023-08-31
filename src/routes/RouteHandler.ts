import { MaybePromise, inferProcedureOutput, initTRPC } from '@trpc/server';
import { ResolveOptions } from 'dns';
import { z } from 'zod';

// Initiate tRPC instance
export const t = initTRPC.create();

// Merge all routers into one appRouter
export const appRouter = t.mergeRouters(pricingRoutes());

// export type definition of API
export type AppRouter = typeof appRouter;

/*
All routes defined below
*/

// Pricing routes definitions
function pricingRoutes(){
    // /getPrice?asset=ethereum&timestamp=unix
    const getPrice = t.procedure.query(test);

    // Return router object
    return t.router({
        getPrice
    })
}

function test(input: any): MaybePromise<any> {
    console.log(input);
}