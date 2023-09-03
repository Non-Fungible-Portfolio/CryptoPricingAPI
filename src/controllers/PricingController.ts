import { GetPriceRequest } from "../definitions/RequestTypes";
import { GetPriceResponse } from "../definitions/ResponseTypes";
import { PricingService } from "../services/PricingService";

export class PricingController {
    static async getPrice(context: GetPriceRequest): Promise<GetPriceResponse>{
        // Get price for asset from the pricing service
        const price = await PricingService.getPrice(context.input.asset, context.input.timestamp);

        // If the service failed, throw error for wrapper to catch
        if(price == null){
            throw new Error("Could not find a price for provided timestamp and asset");
        }

        // Return the retrieved pricing data
        return {
            success: true,
            data: price
        }
    }
}