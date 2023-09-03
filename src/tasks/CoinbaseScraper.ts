import { Logger } from "Logger";
import { CoinbaseClient } from "../clients/CoinbaseClient";
import { PriceAssets } from "../definitions/PriceTypes";
import { PriceModel } from "../models/PriceModel";

export class CoinbaseScraper {
    private sync: Record<PriceAssets, number>;

    constructor(){
        this.sync = {
            ethereum: -1
        };
    }

    async start(){
        const assets: PriceAssets[] = ["ethereum"];

        for(let asset of assets){
            Logger.
            await this.synchronize(asset);
        }
    }

    // This function will synchronize our current database to the current head of the Coinbase candle API
    private async synchronize(asset: PriceAssets){
        const currentTimestamp = Math.floor(Date.now()/1000);
        const databaseTimestamp = (await PriceModel.getLatestPrice(asset)).timestamp;

        // Determine if we need to sync via minutes or half hour intervals
        if(currentTimestamp - databaseTimestamp > 1800){
            // Synchronize the half hour intervals first
            await this.synchronizeIterations(asset, 1800);
        }

        // Now, sync to the head of the API
        await this.synchronizeTimestamps(asset, databaseTimestamp, currentTimestamp);
        // Do this again in 30 seconds
        this.sync[asset] = setTimeout(this.synchronize, 30000);
        return;
    }

    private async synchronizeIterations(asset: PriceAssets, interval: number): Promise<void>{
        // Define a timestamp that stores our last synced timestamp
        let lastTimestamp = Math.floor(Date.now()/1000);
        // Define a timestamp that stores our next desired sync timestamp
        let nextTimestamp = lastTimestamp + interval;

        // Keep syncing until the nextTimestamp is in the future (at which point interval needs to be decreased)
        while(nextTimestamp < Math.floor(Date.now()/1000)){
            await this.synchronizeTimestamps(asset, lastTimestamp, nextTimestamp);

            // Update our timestamps
            lastTimestamp = nextTimestamp;
            nextTimestamp += interval;
        }

        // We're done syncing to the desired interval
        return;
    }

    private async synchronizeTimestamps(asset: PriceAssets, startTimestamp: number, endTimestamp: number){
        const prices = await CoinbaseClient.fetchPrices(startTimestamp, endTimestamp);

        // Array response = [timestamp, ?, ?, ?, price at closing, volume]
        for(let price of prices){
            const timestamp = price[0];
            const closingPrice = price[4];
            const volume = price[5];

            // Insert into database
            await PriceModel.insertPrice(asset, {
                timestamp,
                volume,
                price: closingPrice
            })
        }
    }
}