import { FundingRateService } from "./funding-rate.service";
import { OpenInterestService } from "./open-interest.service";
import { LongShortRatioService } from "./long-short-ratio.service";
import { TakerBuySellVolumeService } from "./taker-buy-sell-volume.service";


// Dataset Builders
const DS_BUILDERS = [
    new FundingRateService(), 
    new OpenInterestService(),
    new LongShortRatioService(),
    new TakerBuySellVolumeService(),
];



// Sync Process
export async function sync_datasets(): Promise<void> {
    for (let ds_builder of DS_BUILDERS) { await ds_builder.sync() }
}