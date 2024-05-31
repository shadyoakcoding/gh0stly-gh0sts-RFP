/*
    This file was written by ChatGPT with the following prompt:
    "I have a folder called "snapshots" in javascript of CSV files. The majority of the files are a csv file that contain an ethereum address and a number on each line. If the file name starts with "1_", add that wallet address to a file called "snapshot_1_totals.csv" along with the number beside it. If the wallet address is already in that csv, just add to the number. When doing anything with a wallet address such, always use toLowerCase to avoid duplication errors.
    Do the same thing for "2_" and "snapshot_2_totals.csv"

    write me code to do this""
*/

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Directory containing the CSV files
const directoryPath = path.join(__dirname, 'snapshots');

// Initialize totals objects for snapshot 1 and 2
let snapshot1Totals = {};
let snapshot2Totals = {};

// Function to process a single CSV file
function processFile(filePath, snapshotTotals) {
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                if (row['wallet'] && row['amount']) {
                    const wallet = row['wallet'].toLowerCase();
                    const amount = parseFloat(row['amount']);
                    if (!isNaN(amount)) {
                        if (snapshotTotals[wallet]) {
                            snapshotTotals[wallet] += amount;
                        } else {
                            snapshotTotals[wallet] = amount;
                        }
                    } else {
                        console.warn(`Invalid amount '${row['amount']}' for wallet '${row['wallet']}' in file '${filePath}'`);
                    }
                } else {
                    console.warn(`Missing wallet or amount in row: ${JSON.stringify(row)} in file '${filePath}'`);
                }
            })
            .on('end', () => {
                resolve();
            })
            .on('error', reject);
    });
}

// Function to write totals to a CSV file
function writeTotalsToFile(snapshotTotals, outputFilePath) {
    const header = 'wallet,amount\n';
    const rows = Object.entries(snapshotTotals)
        .map(([wallet, amount]) => `${wallet},${amount}`)
        .join('\n');
    const csvContent = header + rows;
    fs.writeFileSync(outputFilePath, csvContent);
}

// Main function to process all files in the directory
async function processFiles() {
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
        const filePath = path.join(directoryPath, file);
        if (file.startsWith('1_')) {
            await processFile(filePath, snapshot1Totals);
        } else if (file.startsWith('2_')) {
            await processFile(filePath, snapshot2Totals);
        }
    }

    writeTotalsToFile(snapshot1Totals, path.join(__dirname, 'snapshot_1_totals.csv'));
    writeTotalsToFile(snapshot2Totals, path.join(__dirname, 'snapshot_2_totals.csv'));
}

// Start the processing
processFiles().then(() => {
    console.log('Processing complete.');
}).catch((error) => {
    console.error('Error processing files:', error);
});
