import { Logger } from "Logger";
import { CoinbaseClient } from "../clients/CoinbaseClient";
import { PriceAssets } from "../definitions/PriceTypes";
import { PriceModel } from "../models/PriceModel";
import { log } from "../utils/Log";

export class CoinbaseScraper {
    private sync: Record<PriceAssets, NodeJS.Timeout>;

    constructor(){
        this.sync = {
            ethereum: setTimeout(() => null, 1)
        };
    }

    async start(){
        const assets: PriceAssets[] = ["ethereum"];

        for(let asset of assets){
            log("ASSET SYNC", `Starting synchronization of asset: ${asset}`, "info");
            await this.synchronize(asset);
        }
    }

    // This function will synchronize our current database to the current head of the Coinbase candle API
    private async synchronize(asset: PriceAssets){
        const currentTimestamp = Math.floor(Date.now()/1000);
        const databaseTimestamp = (await PriceModel.getLatestPrice(asset)).timestamp;

        // Determine if we need to sync via minutes or half hour intervals
        if(currentTimestamp - databaseTimestamp > 1800){
            log("ASSET SYNC", `Starting half hour syncs for asset: ${asset}`, "info");
            // Synchronize the half hour intervals first
            await this.synchronizeIterations(asset, 1800);
            log("ASSET SYNC", `Half hour syncs complete for asset: ${asset}`, "info");
        }

        // Now, sync to the head of the API
        log("ASSET SYNC", `Syncing asset ${asset} to head of current Coinbase API`, "info");
        await this.synchronizeTimestamps(asset, databaseTimestamp, currentTimestamp);
        log("ASSET SYNC", `Asset ${asset} caught up to head. Rechecking in 30 seconds.`, "info");
        // Do this again in 30 seconds
        this.sync[asset] = setTimeout(() => {
            this.synchronize(asset)
        }, 30000);
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
        log("ASSET SYNC", `Processing API response for asset ${asset} between timestamps ${startTimestamp} and ${endTimestamp}`, "info");
        // Fetch prices in the time period
        const prices = await CoinbaseClient.fetchPrices(asset, startTimestamp, endTimestamp);

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
        log("ASSET SYNC", `Processed API response for asset ${asset} between timestamps ${startTimestamp} and ${endTimestamp}`, "info");
    }
}