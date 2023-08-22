import { sync_datasets } from "./dataset-builder";

// Print the script title
console.log("BINANCE FUTURES DATASET BUILDER");
console.log(" ");

// Start the syncing process
sync_datasets()
.then(_ => {
    console.log("\n\nThe datasets has been synced successfully");
    process.exit(0);
} )
.catch(e => {
    console.error(e);
    process.exit(1);
});