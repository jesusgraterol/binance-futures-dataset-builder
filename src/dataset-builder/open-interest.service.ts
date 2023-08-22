import { IRawOpenInterestRecord } from "../binance";
import { DatasetBuilder } from "./dataset-builder";
import { IOpenInterestRecord, IOpenInterestService } from "./interfaces";




export class OpenInterestService extends DatasetBuilder implements IOpenInterestService {



    constructor() {
        super(
            "./output/open_interest.csv",
            30
        );
    }





    /**
     * Retrieves the next dataset items based on the given starting point.
     * @param start_at 
     * @returns Promise<IOpenInterestRecord[]>
     */
    protected async get_next_ds_items(start_at: number): Promise<IOpenInterestRecord[]> {
        // Retrieve the records from Binance's API
        const records: IRawOpenInterestRecord[] = await this._binance.get_open_interest_history(start_at);

        // Finally, format the items and return them
        return records.map((r) => { return <IOpenInterestRecord>{ 
            timestamp: r.timestamp,
            sum_open_interest: this.format_number(r.sumOpenInterest, 8),
            sum_open_interest_value: this.format_number(r.sumOpenInterestValue, 8)
        } });
    }
}