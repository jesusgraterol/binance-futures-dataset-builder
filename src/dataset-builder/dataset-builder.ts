import * as fs from "fs";
import * as path_helper from "path";
import { BigNumber } from "bignumber.js";
import moment from "moment";
import { BinanceService, IBinanceService } from "../binance";
import { IDatasetBuilder, IDatasetItem } from "./interfaces";





export class DatasetBuilder implements IDatasetBuilder {
    // The path in which the dataset file is stored
    private dataset_path: string;

    // The maximum number of lookback days an endpoint can be queried
    private max_historic_lookback_days: number;

    // The Binance Service Instance to be accessed by the children
    protected _binance: IBinanceService;

    constructor(
        dataset_path: string,
        max_historic_lookback_days: number = 30
    )  {
        // Initialize the Dataset's Path & File
        this.dataset_path = dataset_path;
        this.initialize_dataset_file();

        // Initialize the maximum historic lookback
        this.max_historic_lookback_days = max_historic_lookback_days;

        // Initialize the Binance Instance
        this._binance = new BinanceService();
    }






    /**
     * Initializes or syncs a dataset.
     * @returns Promise<void>
     */
    public async sync(): Promise<void> {
        // Print process msg
        console.log(`\n${this.constructor.name} Syncing...\n`);

        // Load the dataset file
        let { latest_timestamp, raw_dataset } = this.load_dataset_file();

        // Sync the dataset
        let new_records_found: boolean = true;
        while(new_records_found) {
            // Retrieve the next series
            const new_items: IDatasetItem[] = await this.get_next_ds_items(latest_timestamp);

            /**
             * Only proceed if new items were found. Note that Binance's API seems to
             * have a glitch on some endpoints and sometimes returns records that have
             * already been included in the dataset. In order to prevent an infinite 
             * loop, it is important to require at least 2 records.
             */
            if (new_items.length > 1) {
                // Set the timestamp that will be used on the next query
                latest_timestamp = new_items.at(-1)!.timestamp;

                // If the file is currently empty, add the heading
                if (!raw_dataset.length) raw_dataset = `${Object.keys(new_items[0]).join(",")}`;

                // Add the new items to the raw dataset as long as they haven't been already added
                raw_dataset += new_items.reduce(
                    (
                        accum: string, 
                        current_value: IDatasetItem
                    ) => {
                        if (raw_dataset.includes(String(current_value.timestamp))) {
                            return accum;
                        } else {
                            return accum + `\n${Object.values(current_value).join(",")}`;
                        }
                    },
                    ""
                );

                // Update the dataset file
                this.update_dataset_file(raw_dataset);
            }
            
            // Otherwise, stop the iteration
            else { new_records_found = false }
        }
    }







    /**
     * Retrieves the next dataset items based on the given starting point.
     * @OVERRIDE
     * @param start_at 
     * @returns Promise<IDatasetItem[]>
     */
    protected get_next_ds_items(start_at: number): Promise<IDatasetItem[]> {
        throw new Error(`${this.constructor.name}.get_next_records has not been implemented.`);
    }







    /**
     * This function is invoked when a dataset has not been initialized.
     * It calculates the genesis timestamp based on max_historic_lookback_days.
     * @OVERRIDE If the lookback data uses a different logic (F.e: Funding Rate)
     * @returns number
     */
    protected calculate_genesis_timestamp(): number {
        return moment().subtract(this.max_historic_lookback_days, "days").valueOf();
    } 










    /***********************
     * File System Helpers *
     ***********************/





    /**
     * Initializes the dataset file in case it hadn't been.
     */
    private initialize_dataset_file(): void {
        // Only proceed if the dataset file does not exist
        if (!this.path_exists(this.dataset_path)) {
            // Check if the directory needs to be created
            const dir_name: string = path_helper.dirname(this.dataset_path);
            if (!this.path_exists(dir_name)) fs.mkdirSync(dir_name);

            // Create the csv file
            this.update_dataset_file("");
        }
    }



    /**
     * Updates the dataset file with the latest state.
     * @param new_data_state
     */
    private update_dataset_file(new_data_state: string): void {
        fs.writeFileSync(this.dataset_path, new_data_state, "utf-8");
    }




    /**
     * Verifies if a given directory or file exists.
     * @returns boolean
     */
    private path_exists(file_or_dir_path: string): boolean {
        try {
            fs.accessSync(file_or_dir_path);
            return true;
        } catch (e) { return false }
    }





    /**
     * Loads the dataset file and returns it in string format. It also
     * derives the latest record's timestamp so the syncing can be resumed.
     * @returns { latest_timestamp: number, raw_dataset: string }
     */
    private load_dataset_file(): { latest_timestamp: number, raw_dataset: string } {
        // Load the raw data
        const raw_dataset: string = fs.readFileSync(this.dataset_path).toString();

        // If the file contains data, extract the latest timestamp
        if (raw_dataset.length) {
            return { 
                latest_timestamp: Number(raw_dataset.split("\n").at(-1)!.split(",")[0]), 
                raw_dataset: raw_dataset 
            }
        }

        // Otherwise, return the defaults
        else { return { latest_timestamp: this.calculate_genesis_timestamp(), raw_dataset: "" } }
    }


















    /****************
     * Misc Helpers *
     ****************/





    /**
     * Formats a number into the proper format. The value returned from
     * this function is the one that will be stored in the ds.
     * @param value 
     * @param decimal_places 
     * @param round_up 
     * @returns number
     */
    protected format_number(
        value: number|string|BigNumber, 
        decimal_places: number = 2, 
        round_up: boolean = true
    ): number {
        // Initialize the value's instance
        const bn: BigNumber = BigNumber.isBigNumber(value) ? value: new BigNumber(value);
        
        // Finally, round and format the value
        return bn
        .decimalPlaces(
            decimal_places, 
            round_up ? BigNumber.ROUND_UP: BigNumber.ROUND_DOWN
        ).toNumber();
    }
}