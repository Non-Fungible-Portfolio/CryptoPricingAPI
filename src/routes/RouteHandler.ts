import { MaybePromise, inferProcedureOutput, initTRPC } from '@trpc/server';
import { ResolveOptions } from 'dns';
import { z } from 'zod';
import { PricingController } from '../controllers/PricingController';
import { forwardCall } from '../utils/RouteForwarder';
import { GetPriceRequest } from '../definitions/RequestTypes';
import { GetPriceResponse } from '../definitions/ResponseTypes';

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
    // /getPrice?input=${uriEncodeComponent(JSON.stringify({asset, timestamp}))}
    const getPrice = t.procedure.input(
        z.object({
            asset: z.enum(["ethereum"]),
            timestamp: z.number()
        })
    ).query(async opts => await forwardCall<GetPriceRequest, GetPriceResponse>(PricingController.getPrice)(opts));

    // Return router object
    return t.router({
        getPrice
    })
}