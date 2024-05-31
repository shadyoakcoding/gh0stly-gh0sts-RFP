# gh0stly-gh0sts-RFP
A repo to assist getting the wallet list for the Gh0stly Gh0sts RFP submission.

Two snapshots will be taken to determine eligibility. The first snapshot is Layer Zero Snapshot #1 which was at 11:59:59 UTC on May 1st or Unix timestamp 1714607999. The second snapshot was taken at 5:27:26 PM UTC on May 10th or Unix timestamp 1715362046 which was the time of the RFP announcement tweet. The exact time was found by inputting the [RFP Announcement tweet](https://twitter.com/LayerZero_Labs/status/1788984201930301901) into [this website](https://oduwsdl.github.io/tweetedat/).
Below are the contract addresses and block numbers for each timestamp on each network that Gh0stly Gh0sts where are deployed.
Ethereum: 0xA74aE2c6FCa0CEdbAef30A8CEEF834B247186bcF | 19778725 | 19841123
Binance Smart Chain: 0xEc1Df7EdFcdC2e2042c63252c1cEF480f64F9189 | 38355068 | 38605927
Avalanche: 0x6047782281C8A3eC7F847EB2dA5222376e1C13E0 | 44915298 | 45272895
Arbitrum: 0xEc1Df7EdFcdC2e2042c63252c1cEF480f64F9189 | 206880524 | 209877205
Polygon: 0xEc1Df7EdFcdC2e2042c63252c1cEF480f64F9189 | 56475332 | 56809856
Fantom: 0xEc1Df7EdFcdC2e2042c63252c1cEF480f64F9189 | 80293098 | 80724968
Optimism: 0xEc1Df7EdFcdC2e2042c63252c1cEF480f64F9189 | 119504611 | 119881634

In order to get the list of wallets, snapshots were taken at each timestamp to get the amount of Gh0stly Gh0sts each wallet was holding. If the number was lower after second snapshot, that wallet would be removed from the holder portion of the RFP. For Ethereum Mainnet, Binance Smart Chain, Arbitrum, Polygon, and Optimism, snapshots were taken using [holders.at](https://holders.at/). Other methods were used for Fantom and Avalanche as holders.at does not support those networks.

For the Fantom snapshot, I had a look at the [transfers](https://ftmscan.com/token/0xEc1Df7EdFcdC2e2042c63252c1cEF480f64F9189) for the NFTs on Fantom and noticed that there has only been [one transaction](https://ftmscan.com/tx/0xbb242a587866d9592bf0525a2fc8858e07df7e39e217c17d8c6c4149aedbb889) since Layer Zero Snapshot #1 but it was after the RFP announcement so I just downloaded a export from ftmscan and converted it to the same CSV format as the other files. As the transaction was wallet 0x85c4cDbBe7cbb7eEcecA0F835E66451De5a61D1C receiving a Gh0st after the RFP announcement, I have manually removed their wallet from the Fantom csv files.

The Avalanche snapshot was somewhat similar but there was [one transaction](https://snowtrace.io/tx/0x4282ce5db849246db197faa0a7386f36ca19a34807ddfedea1e545e397f5f9cf?chainId=43114) in between the two snapshots where wallet 0x27Af137AAEf7BD85ae84Be841fDD8cBb8e79d3f7 bridged their Gh0st to ETH Mainnet so I added their wallet to the first snapshot csv on Avalanche. There were also two more transactions of people bridging their ghost that happened after the RFP announcement so I have manually added them to both snapshots as well. 
0x85c4cDbBe7cbb7eEcecA0F835E66451De5a61D1C [transaction 1](https://snowtrace.io/tx/0x4c04bb9dce96b489866d1469e809db0958671d9973690d51433f198f212eefef?chainId=43114)
0xFce8BA1CDA4070e4b31fD2909903Be1DA53Ae308 [transaction 2](https://snowtrace.io/tx/0x3d899c0ae8df17be8474feb58d1fff65bf7a873c5b505ccca2e218450b764245?chainId=43114)

In order to simplify coding the total elligible holder counts I have added "1_" at the start of csv files for snapshot 1 and "2_" at the start of files for snapshot 2. I have also added "wallet,amount" at the top of every csv file to help parse through it with csv-parser.