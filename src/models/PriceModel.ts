import postgres from "postgres";
import { PriceAssets, PriceResult } from "../definitions/PriceTypes";

export class PriceModel {
    private static sql: postgres.Sql;

    constructor(){
        // sql initiation here
        PriceModel.sql = postgres({
            host: process.env.DB_HOST,
            database: process.env.DB_DB,
            username: process.env.DB_USER,
            password: process.env.DB_PWD,
            port: parseInt(process.env.DB_PORT ?? "5432")
        });
    }

    static async insertPrice(asset: PriceAssets, price: PriceResult): Promise<void>{
        // If the price exists, make sure to delete it first
        const existingRows = await this.sql`
            SELECT timestamp FROM pricing.${this.sql(asset)} WHERE timestamp = ${price.timestamp}
        `;

        if(existingRows.length > 0){
            // Delete existing rows from database
            await this.sql`
                DELETE FROM pricing.${this.sql(asset)} WHERE timestamp = ${price.timestamp}
            `;
        }

        // Now we can insert into the database knowing we have no conflicts
        await this.sql`
            INSERT INTO pricing.${this.sql(asset)} (timestamp, price, volume) VALUES (${price.timestamp}, ${price.price}, ${price.volume})
        `;
    }

    static async getPrices(asset: PriceAssets, timestamp: number, minuteWindow: number): Promise<PriceResult[]>{
        // Get all results within a 2 minute window
        const results = await this.sql`
            SELECT * FROM pricing.${this.sql(asset)} WHERE timestamp BETWEEN ${timestamp - (minuteWindow * 60)} AND ${timestamp + (minuteWindow * 60)}
        ` as PriceResult[];

        // Cast all resulting timestamps to numbers
        results.map((result) => result.timestamp = parseInt(`${result.timestamp}`));

        return results;
    }

    static async getLatestPrice(asset: PriceAssets): Promise<PriceResult>{
        // Get the latest pricing result (as an array with 1 item)
        const latestResult = await this.sql`
            SELECT * FROM pricing.${this.sql(asset)} ORDER BY timestamp DESC LIMIT 1;
        ` as PriceResult[];

        // Cast all resulting timestamps to numbers
        latestResult.map((result) => result.timestamp = parseInt(`${result.timestamp}`));

        // Return our price result (there can only be one item in the array)
        return latestResult[0];
    }
}

// Create the first instance
new PriceModel();