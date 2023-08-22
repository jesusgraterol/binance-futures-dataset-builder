


/********
 * Core *
 ********/




/**
 * Dataset Builder Class
 * This class performs the core dataset builder actions and should be 
 * extended by the services.
 */
export interface IDatasetBuilder {
    sync(): Promise<void>
}




// Dataset Item
export type IDatasetItem = IFundingRateRecord|IOpenInterestRecord;




/**
 * Dataset Item Skeleton
 * All datasets built by the script must have the timestamp property (in ms) 
 * so they can be initialized and then synced throught time.
 */
export interface IDatasetItemSkeleton {
    timestamp: number
}










/****************
 * Funding Rate *
 ****************/



// Service
export interface IFundingRateService extends IDatasetBuilder { }



// Record
export interface IFundingRateRecord extends IDatasetItemSkeleton {
    funding_rate: number
}







/*****************
 * Open Interest *
 *****************/


// Service
export interface IOpenInterestService extends IDatasetBuilder { }



// Record
export interface IOpenInterestRecord extends IDatasetItemSkeleton {
    // Total open interest (BTC)
    sum_open_interest: number,

    // Total open interest value (USDT)
    sum_open_interest_value: number
}