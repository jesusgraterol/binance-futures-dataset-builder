import { IRawLongShortRatioRecord } from "../binance";
import { DatasetBuilder } from "./dataset-builder";
import { ILongShortRatioService, ILongShortRatioRecord } from "./interfaces";




export class LongShortRatioService extends DatasetBuilder implements ILongShortRatioService {



    constructor() {
        super(
            "./output/long_short_ratio.csv",
            30
        );
    }





    /**
     * Retrieves the next dataset items based on the given starting point.
     * @param start_at 
     * @returns Promise<ILongShortRatioRecord[]>
     */
    protected async get_next_ds_items(start_at: number): Promise<ILongShortRatioRecord[]> {
        // Retrieve the records from Binance's API
        const records: IRawLongShortRatioRecord[] = await this._binance.get_long_short_ratio_history(start_at);

        // Finally, format the items and return them
        return records.map((r) => { return <ILongShortRatioRecord>{ 
            timestamp: r.timestamp,
            long_account: this.format_number(r.longAccount, 4),
            short_account: this.format_number(r.shortAccount, 4),
            long_short_ratio: this.format_number(r.longShortRatio, 4)
        } });
    }
}