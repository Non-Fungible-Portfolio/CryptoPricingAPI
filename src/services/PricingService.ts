import { PriceResult } from "../definitions/PriceTypes";
import { PriceModel } from "../models/PriceModel";

export class PricingService {
    static async getPrice(asset: "ethereum", timestamp: number): Promise<PriceResult | null>{
        // Get all prices from the database in a 2 minute window around the provided timestamp
        const prices = await PriceModel.getPrices(asset, timestamp, 2);

        // Constant variables to determine closest record in DB to desired timestamp
        let closestValue = Number.MAX_VALUE;
        let closestResult: PriceResult | null = null;

        // Loop through all the results and use the closest absolute value to determine the closest neighbor
        for(let result of prices){
            const resultTimestamp = result.timestamp;
            if(Math.abs(timestamp - resultTimestamp) < closestValue){
                closestResult = result as PriceResult;
                closestValue = Math.abs(timestamp - resultTimestamp);
            }
        }

        // Return our result (or null)
        return closestResult;
    }
}