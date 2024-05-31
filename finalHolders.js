/*
    This file was written by ChatGPT with the following prompt:
    "I have two csv files in javascript "snapshot_1_totals.csv" and "snapshot_2_totals.csv". Each file contains two columns: "wallet" and "amount". The first column is an ethereum wallet address and the second column is an integer.

    Write me code in javascript that goes through all of "snapshot_1_totals.csv" and checks if the wallet has a lower amount in "snapshot_2_totals.csv". If it does not have a lower amount, add it the wallet and amount from "snapshot_1_totals.csv" to file called "final_holder_snapshot.csv".

    If the wallet isn't in "snapshot_2_totals.csv", consider it as having an amount of 0. Only use csv-parser and fs."
*/

const fs = require('fs');
const csv = require('csv-parser');

const snapshot1 = 'snapshot_1_totals.csv';
const snapshot2 = 'snapshot_2_totals.csv';
const finalSnapshot = 'final_holder_snapshot.csv';

const walletsSnapshot1 = new Map();

// Read snapshot 1 and store data in a Map
fs.createReadStream(snapshot1)
    .pipe(csv())
    .on('data', (data) => {
        const wallet = data.wallet;
        const amount = parseInt(data.amount);
        walletsSnapshot1.set(wallet, amount);
    })
    .on('end', () => {
        // Compare with snapshot 2
        fs.createReadStream(snapshot2)
            .pipe(csv())
            .on('data', (data) => {
                const wallet = data.wallet;
                const amountSnapshot2 = parseInt(data.amount);
                if (walletsSnapshot1.has(wallet)) {
                    const amountSnapshot1 = walletsSnapshot1.get(wallet);
                    if (amountSnapshot1 <= amountSnapshot2) {
                        appendToFile(finalSnapshot, wallet, amountSnapshot1);
                    }
                } else {
                    appendToFile(finalSnapshot, wallet, 0);
                }
            })
            .on('end', () => {
                console.log('Comparison complete.');
            });
    });

function appendToFile(fileName, wallet, amount) {
    const row = `${wallet},${amount}\n`;
    fs.appendFile(fileName, row, (err) => {
        if (err) throw err;
        console.log(`Added ${wallet} with amount ${amount} to ${fileName}`);
    });
}
