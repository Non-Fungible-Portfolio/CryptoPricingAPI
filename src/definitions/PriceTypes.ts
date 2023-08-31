export type PriceAssets = "ethereum";

export interface PriceResponse {
    asset: PriceAssets,
    price: number,
    timestamp: number,
    volume: number
}