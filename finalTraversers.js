/*
    This file is written completely by Chat GPT with the following prompt because I am lazy:
    "Write me code in javascript that reads csv files from a folder called "traversers". Only read the csv files that end with "_traversers.csv". Each file contains a list of ethereum wallet addresses. Please create a csv file called "finalTraversers.csv" by adding the addresses from each csv file one by one. Before adding it, check to make sure it isn't there already. The final csv should have all addresses but never more than once. Always do .toLowerCase when comparing addresses to avoid duplicates. If needed use csv-parser and fs. Ignore empty files in the csv."
*/

const fs = require('fs');
const csv = require('csv-parser');

const traversersFolder = './traversers';
const finalTraversersFile = 'finalTraversers.csv';
const addressesSet = new Set();

fs.readdir(traversersFolder, (err, files) => {
  if (err) {
    console.error('Error reading traversers folder:', err);
    return;
  }

  files.forEach(file => {
    if (file.endsWith('_traversers.csv')) {
      const filePath = `${traversersFolder}/${file}`;
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          const addresses = Object.values(data).filter(address => address.trim() !== '');
          addresses.forEach(address => {
            const lowercaseAddress = address.trim().toLowerCase();
            if (!addressesSet.has(lowercaseAddress)) {
              addressesSet.add(lowercaseAddress);
              appendAddressToFile(lowercaseAddress);
            }
          });
        })
        .on('end', () => {
          console.log(`Finished reading file ${file}`);
        });
    }
  });
});

function appendAddressToFile(address) {
  fs.appendFile(finalTraversersFile, `${address}\n`, (err) => {
    if (err) {
      console.error(`Error appending address ${address} to ${finalTraversersFile}:`, err);
    }
  });
}
