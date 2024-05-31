/*
    Most of this was written by Chat GPT but I don't have the prompt because I was messing around with it for way too long and kept feeding it more inputs.
    I also did a lot of editing afterwards (lol)
*/

require('dotenv').config();
const path = require('path');
const fs = require('fs');

const saveLogsFromEtherscan = async (chain, contractAddress, etherscanAPIEndpoint, snapshotBlock, apiKey) => {
    const endpoint = `${etherscanAPIEndpoint}?module=logs&action=getLogs&fromBlock=0&toBlock=${snapshotBlock}&address=${contractAddress}&topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&topic0_2_opr=and&topic2=0x0000000000000000000000000000000000000000000000000000000000000000&page=1&offset=1000&apikey=${apiKey}`;
    console.log(`Making API call for data from ${etherscanAPIEndpoint}`)
    try {
        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.status === "1") {
            const transactions = data.result;
            const uniqueAddresses = new Set();
            transactions.forEach(transaction => {
                const topic1 = transaction.topics[1];
                const address = "0x" + topic1.slice(-40);
                uniqueAddresses.add(address);
            });
            const addresses = Array.from(uniqueAddresses);
            const csvData = createCSV(addresses);
            saveCSVToFile(csvData, chain);
        } else {
            console.error("Error fetching logs:", data.message);
            return [];
        }
    } catch (error) {
        console.error("Error fetching logs:", error);
        return [];
    }
};

const createCSV = (addresses) => {
    let csvContent = "address\n";

    addresses.forEach(address => {
        csvContent += address + "\n";
    });

    return csvContent;
};

const saveCSVToFile = (csvData, chain) => {
    const folderPath = path.join(__dirname, 'traversers');
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }

    const filePath = path.join(folderPath, `${chain}_traversers.csv`);
    fs.writeFileSync(filePath, csvData);
    console.log(`CSV file saved to: ${filePath}`);
};

(async () => {
    await saveLogsFromEtherscan("eth", "0xA74aE2c6FCa0CEdbAef30A8CEEF834B247186bcF", "https://api.etherscan.io/api", "19778725", process.env.ETHERSCANAPI);
    await saveLogsFromEtherscan("bsc", "0xEc1Df7EdFcdC2e2042c63252c1cEF480f64F9189", "https://api.bscscan.com/api", "38355068", process.env.BSCSCANAPI);
    await saveLogsFromEtherscan("arb", "0xEc1Df7EdFcdC2e2042c63252c1cEF480f64F9189", "https://api.arbiscan.io/api", "206880524", process.env.ARBISCANAPI);
    await saveLogsFromEtherscan("polygon", "0xEc1Df7EdFcdC2e2042c63252c1cEF480f64F9189", "https://api.polygonscan.com/api", "56475332", process.env.POLYGONSCANAPI);
    await saveLogsFromEtherscan("fantom", "0xEc1Df7EdFcdC2e2042c63252c1cEF480f64F9189", "https://api.ftmscan.com/api", "80293098", process.env.FTMSCANAPI);
    await saveLogsFromEtherscan("optimism", "0xEc1Df7EdFcdC2e2042c63252c1cEF480f64F9189", "https://api-optimistic.etherscan.io/api", "119504611", process.env.OPTIMISMSCANAPI);
})();