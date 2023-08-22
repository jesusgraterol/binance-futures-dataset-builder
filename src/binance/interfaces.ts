




/**
 * Service
 * This service is responsible for interacting with Binance's Futures API.
 */
export interface IBinanceService {
    get_funding_rate_history(start_time: number): Promise<IRawFundingRateRecord[]>,
    get_open_interest_history(start_time: number): Promise<IRawOpenInterestRecord[]>,
    get_long_short_ratio_history(start_time: number): Promise<IRawLongShortRatioRecord[]>,
    get_taker_buy_sell_volume_history(start_time: number): Promise<IRawTakerBuySellVolumeRecord[]>,
}







/**
 * Raw Funding Rate Record
 * https://www.binance.com/en/blog/futures/what-is-futures-funding-rate-and-why-it-matters-421499824684903247
 */
export interface IRawFundingRateRecord {
    // The request's symbol. Will always be: "BTCUSDT"
    symbol: string,

    // The time at which the rate snapshot was taken
    fundingTime: number,

    // The funding rate value (String Format)
    fundingRate: string
}



/**
 * Raw Open Interest Record
 * https://www.binance.com/en/blog/futures/what-information-does-open-interest-convey-421499824684900398
 */
export interface IRawOpenInterestRecord {
    // The request's symbol. Will always be: "BTCUSDT"
    symbol: string,

    // The time at which the open interest snapshot was taken
    timestamp: number,

    // Total open interest (BTC)
    sumOpenInterest: string,

    // Total open interest value (USDT)
    sumOpenInterestValue: string
}



/**
 * Raw Long/Short Ratio Record
 * https://www.binance.com/en/blog/futures/what-is-longshort-ratio-and-what-does-it-convey-in-cryptocurrency-futures-6728490800036398885
 */
export interface IRawLongShortRatioRecord {
    // The request's symbol. Will always be: "BTCUSDT"
    symbol: string,

    // The time at which the long/short ratio snapshot was taken
    timestamp: number,

    // Long account num ratio of all traders
    longAccount: string,

    // Short account num ratio of all traders
    shortAccount: string,

    // Long/Short account num ratio of all traders
    longShortRatio: string
}




/**
 * Raw Taker Buy/Sell Volume Record
 * https://www.binance.com/en/feed/post/164092
 */
export interface IRawTakerBuySellVolumeRecord {
    // The request's symbol. Will always be: "BTCUSDT"
    symbol: string,

    // The time at which the long/short ratio snapshot was taken
    timestamp: number,

    // Total BTC volume bought by Takers
    buyVol: string,

    // Total BTC volume sold by Takers
    sellVol: string,

    // The taker buy/sell ratio
    buySellRatio: string
}