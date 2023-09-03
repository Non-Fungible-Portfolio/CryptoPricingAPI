# Crypto Pricing API
The crypto pricing API is used to scrape and return crypto pricing for specified assets from the Coinbase Pro Candles API.

## Routes
To add a new route, follow the following steps:
1. Create a new Controller and Service file with the necessary logic
2. Determine the schemas the route will need (response and request schemas)
3. Define three types in `definitions/RequestTypes.ts` for the request object.
    1. The first type will be the actual input for the request as a TypeScript interface
    2. The second type will be the first type redefined in Zod
    3. The third type will the first type extending the base RequestPayload 
4. Define two types in `definitions/ResponseTypes.ts`
    1. The first type is the response type of the route (extending SuccessResponse)
    2. The second type is the first type redefined in Zod
5. Define the route in a custom function (or add to an existing if it fits better) using the following code
```
t.procedure
        .input([Type defined in 3.2])
        .output([Type defined in 4.2].or(ErrorResponseZod))
        .query(async opts => await forwardCall<[Type defined in 3.3], [Type defined in 4.1]>([Controller function to forward validated input through])(opts));
```
6. Register the route into the mergeRouters function (if a new function was added)

## Files
bin/HTTPServer.ts - Handles logic related to starting the service  
clients/CoinbaseClient.ts - Handles any interfacing with the Coinbase Pro Candles API  
definitions/PriceTypes.ts - Contains definitions for all price types  
definitions/RequestTypes.ts - Contains definitions for all request types (request payloads, base request payload, etc.)  
definitions/ResponseTypes.ts - Contains definitions for all response types (success payloads, error responses, etc.)  
models/PriceModel.ts - Handles interfacing with the PSQL database  
routes/RouteContext.ts - Handles providing Fastify request context to all incoming requests   
routes/RouteHandler.ts - Handles registering all routes and sending to the proper controller and validating input/output  
services/PricingServices.ts - Handles all calls related to retrieving prices from the database  
tasks/CoinbaseScraper.ts - Long-running task that constantly keeps the API prices to the head of the Coinbase API  
utils/Log.ts - Wrapper function for the Logger library  
utils/RouteForwarder.ts - Wraps route handler functions with error handling as well as type inference for the output and inputs of statically declared route handler functions  
util/TimeUtils.ts - Necessary time utilities for interfacing with the Coinbase API  

## Environment variables
HTTP_PORT=Port to run the API on  
DB_HOST=Host of the PSQL DB  
DB_DB=Database of the PSQL DB  
DB_USER=Username which has access to the database of the PSQL DB  
DB_PWD=Password to the username above  
DB_PORT=Port of the PSQL DB  