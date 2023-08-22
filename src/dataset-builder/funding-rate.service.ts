import { IRawFundingRateRecord } from "../binance";
import { DatasetBuilder } from "./dataset-builder";
import { IFundingRateRecord, IFundingRateService } from "./interfaces";




export class FundingRateService extends DatasetBuilder implements IFundingRateService {
    /**
     * Genesis Timestamp
     * The time at which Binance Futures first launched and the beginning
     * of the funding rate history.
     */
    private readonly genesis_timestamp: number = 1568102400000;




    constructor() {
        super(
            "./output/funding_rate.csv"
        );
    }



    /**
     * Retrieves the next dataset items based on the given starting point.
     * @param start_at 
     * @returns Promise<IFundingRateRecord[]>
     */
    protected async get_next_ds_items(start_at: number): Promise<IFundingRateRecord[]> {
        // Retrieve the records from Binance's API
        const records: IRawFundingRateRecord[] = await this._binance.get_funding_rate_history(start_at);

        // Finally, format the items and return them
        return records.map((r) => { return <IFundingRateRecord>{ 
            timestamp: r.fundingTime,
            funding_rate: this.format_number(r.fundingRate, 8)
        } });
    }






    /**
     * This function is invoked when a dataset has not been initialized and 
     * returns the genesis timestamp which was set when Binance Futures stated
     * operating.
     * @returns number
     */
    protected calculate_genesis_timestamp(): number { return this.genesis_timestamp } 
}