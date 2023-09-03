import { MaybePromise, inferProcedureOutput, initTRPC } from '@trpc/server';
import { ResolveOptions } from 'dns';
import { z } from 'zod';
import { PricingController } from '../controllers/PricingController';
import { forwardCall } from '../utils/RouteForwarder';
import { GetPricePayload, GetPriceRequest, GetPriceRequestZod } from '../definitions/RequestTypes';
import { ErrorResponseZod, GetPriceResponse, GetPriceResponseZod } from '../definitions/ResponseTypes';

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
    const getPrice = t.procedure
        .input(GetPriceRequestZod)
        .output(GetPriceResponseZod.or(ErrorResponseZod))
        .query(async opts => await forwardCall<GetPricePayload, GetPriceResponse>(PricingController.getPrice)(opts));

    // Return router object
    return t.router({
        getPrice
    })
}