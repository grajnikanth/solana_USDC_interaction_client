// demo/mint.account.ts

import {Connection, PublicKey} from '@solana/web3.js';
import {Buffer} from "buffer";
import * as BufferLayout from '@solana/buffer-layout';

let connection: Connection = new Connection("http://api.mainnet-beta.solana.com", "confirmed");;


async function main() {

    let usdc = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
    let usdcAcctInfo = await connection.getAccountInfo(usdc);
    console.log('\n USDC Token Account Info:');
    console.log(usdcAcctInfo);
    console.log("\n usdc data is ");
    console.log(usdcAcctInfo.data);
    console.log("Total Bytes in the data buffer ");
    console.log(usdcAcctInfo.data.length);

    // Decode first 4 bytes of the "data" buffer for the usdcAcctInfo
    // The data structre on smart contract is the "Mint" struct
    // little endian reading of buffer for the first four bytes using
    // Buffer library functions of Javascript
    let mintAuthorityCoption = usdcAcctInfo.data.readUIntLE(0,4);
    console.log("\n Mint_Authority_Coption value is");
    console.log(mintAuthorityCoption);

    // Decode next 32 bytes to a PublicKey based on the Mint Struct
    let mintAuthority = new PublicKey(usdcAcctInfo.data.subarray(4, 36)).toBase58();
    console.log("\n Mint Authoriy Public Key is ");
    console.log(mintAuthority);

    // decode the next 8 bytes representing supply field of Mint struct
    let ns64 = new BufferLayout.NearUInt64();
    let supplySlice = usdcAcctInfo.data.subarray(36, 44);
    let arr = new Uint8Array(supplySlice);
    console.log("Uint8Array is");
    console.log(arr);
    let supply = ns64.decode(arr);
    console.log("\n Supply decoded ");
    console.log(supply);

    // decode next 1 byte representing the field decimals - u8
    let decimal = usdcAcctInfo.data.readUIntLE(44, 1);
    console.log("\n decimal value is");
    console.log(decimal);

    // convert supply to the acutal decimal number
    console.log("Supply converted to a decimal")
    console.log(supply/(10**decimal));

    // Decode the next 1 byte representing is_initialized field on Mint struct
    let isInitialized = usdcAcctInfo.data.readUIntLE(45, 1);
    console.log("\n is_initialized value is ");
    console.log(isInitialized);

    // Decode the next 36 bytes to obtain field freeze_authority COption and
    // PublicKey
    let freezeAuthorityCOption = usdcAcctInfo.data.readUIntLE(46,4);
    console.log("\n freeze_Authority_COption value is");
    console.log(freezeAuthorityCOption);
    let freezeAuthority = new PublicKey(usdcAcctInfo.data.subarray(50)).toBase58();
    console.log("\n Mint Authoriy Public Key is ");
    console.log(freezeAuthority);


}

main().then(
    () => process.exit(),
    err => {
        console.error(err);
        process.exit(-1)
    }
)