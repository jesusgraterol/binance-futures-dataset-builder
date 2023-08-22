import { FundingRateService } from "./funding-rate.service";
import { OpenInterestService } from "./open-interest.service";


// Dataset Builders
const DS_BUILDERS = [
    new FundingRateService(), 
    new OpenInterestService(),
];



// Sync Process
export async function sync_datasets(): Promise<void> {
    for (let ds_builder of DS_BUILDERS) { await ds_builder.sync() }
}