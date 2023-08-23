import moment from "moment";
import { 
    ExternalRequestService, 
    IExternalRequestOptions, 
    IExternalRequestResponse, 
    IExternalRequestService 
} from "../external-request";
import { request_throttle } from "./request-throttle";
import { 
    IBinanceService, 
    IQueryDateRange,
    IRawFundingRateRecord,
    IRawLongShortRatioRecord,
    IRawOpenInterestRecord,
    IRawTakerBuySellVolumeRecord
} from "./interfaces";




export class BinanceService implements IBinanceService {
    // Binance's Request Options Skeleton
    private readonly request_options: IExternalRequestOptions = {
        host: "fapi.binance.com",
        path: "",
        method: "GET",
        headers: { "Content-Type": "application/json" }
    }

    // External Request Service
    private _external_request: IExternalRequestService;

    constructor() {
        // Initialize the external request instance
        this._external_request = new ExternalRequestService();

        // ...
    }









    /**
     * Retrieves the funding rate history based on given starting point.
     * @param start_time 
     * @returns Promise<IRawFundingRateRecord[]>
     */
    @request_throttle()
    public async get_funding_rate_history(start_time: number): Promise<IRawFundingRateRecord[]> {
        // Send the request
        const { start, end } = this.calculate_query_date_range(start_time, 200);
        const response: IExternalRequestResponse = await this._external_request.request({
            ...this.request_options,
            path: `/fapi/v1/fundingRate?symbol=BTCUSDT&limit=1000&startTime=${start}&endTime=${end}`
        });

        // Validate the response
        this.validate_request_response(response);

        // Return the series
        return response.data;
    }






    
    /**
     * Retrieves the open interest history based on given starting point.
     * @param start_time 
     * @returns Promise<IRawOpenInterestRecord[]>
     */
    @request_throttle()
    public async get_open_interest_history(start_time: number): Promise<IRawOpenInterestRecord[]> {
        // Send the request
        const { start, end } = this.calculate_query_date_range(start_time);
        const response: IExternalRequestResponse = await this._external_request.request({
            ...this.request_options,
            path: `/futures/data/openInterestHist?symbol=BTCUSDT&period=5m&limit=500&startTime=${start}&endTime=${end}`
        });

        // Validate the response
        this.validate_request_response(response);

        // Return the series
        return response.data;
    }









    
    /**
     * Retrieves the long/short ratio history based on given starting point.
     * @param start_time 
     * @returns Promise<IRawLongShortRatioRecord[]>
     */
    @request_throttle()
    public async get_long_short_ratio_history(start_time: number): Promise<IRawLongShortRatioRecord[]> {
        // Send the request
        const { start, end } = this.calculate_query_date_range(start_time);
        const response: IExternalRequestResponse = await this._external_request.request({
            ...this.request_options,
            path: `/futures/data/globalLongShortAccountRatio?symbol=BTCUSDT&period=5m&limit=500&startTime=${start}&endTime=${end}`
        });

        // Validate the response
        this.validate_request_response(response);

        // Return the series
        return response.data;
    }







    
    /**
     * Retrieves the taker buy/sell volume history based on given starting point.
     * @param start_time 
     * @returns Promise<IRawTakerBuySellVolumeRecord[]>
     */
    @request_throttle()
    public async get_taker_buy_sell_volume_history(start_time: number): Promise<IRawTakerBuySellVolumeRecord[]> {
        // Send the request
        const { start, end } = this.calculate_query_date_range(start_time);
        const response: IExternalRequestResponse = await this._external_request.request({
            ...this.request_options,
            path: `/futures/data/takerlongshortRatio?symbol=BTCUSDT&period=5m&limit=500&startTime=${start}&endTime=${end}`
        });

        // Validate the response
        this.validate_request_response(response);

        // Return the series
        return response.data;
    }
















    /****************
     * Misc Helpers *
     ****************/
    



    /**
     * Given an HTTP Response object, it will ensure the request was 
     * processed correctly and has the correct status code.
     * @param response 
     * @param validate_data 
     */
    private validate_request_response(response: IExternalRequestResponse, validate_data: boolean = true): void {
        // Ensure it is a valid object
        if (!response || typeof response != "object") {
            console.log(response);
            throw new Error("Binance's API returned an invalid response object.");
        }

        // Ensure the status code is valid
        if (response.status_code != 200) {
            throw new Error(`Binance's API returned an invalid HTTP response code. 
            Expected: 200, Received: ${response.status_code}`);
        }

        // Validate the response's data
        if (validate_data && !Array.isArray(response.data)) {
            console.log(response.data);
            throw new Error(`Binance's API returned an invalid series of records. Received: ${typeof response.data}`);
        }
    }






    /**
     * Calculates the query's date range based on the starting time. 
     * Keep in mind it will add 1 second to the starting time in order
     * to prevent duplicate records.
     * @param start_time 
     * @param query_days_length 
     * @returns IQueryDateRange
     */
    private calculate_query_date_range(start_time: number, query_days_length: number = 1): IQueryDateRange {
        return {
            start: start_time + 1000, // Add an extra 1000 milliseconds
            end: moment(start_time).add(query_days_length, "days").valueOf()
        }
    }
}