import axios from "axios";
import { log } from "../utils/Log";
import { PriceAssets } from "../definitions/PriceTypes";
import { unixToISO } from "../utils/TimeUtils";

export type CoinbasePricingResponse = Array<Array<number>>;

export class CoinbaseClient {
    static async fetchPrices(asset: PriceAssets, timestamp: number, endTimestamp: number = timestamp + 60): Promise<CoinbasePricingResponse>{
        log("COINBASE CLIENT", `Fetching timestamps ${timestamp} to ${endTimestamp} for asset ${asset}`, "info");
        const response = await axios({
            method: "GET",
            url: `https://api.exchange.coinbase.com/products/${this.assetToPair(asset)}/candles?granularity=60&start=${unixToISO(timestamp)}&end=${unixToISO(endTimestamp)}`,
            timeout: 5000
        });

        log("COINBASE CLIENT", `Fetched timestamps ${timestamp} to ${endTimestamp} for asset ${asset} - got ${response.data.length} records`, "info");

        return response.data as CoinbasePricingResponse;
    }

    private static assetToPair(asset: PriceAssets): string{
        switch(asset){
            case "ethereum":
                return "ETH-USD";
        }
    }
}