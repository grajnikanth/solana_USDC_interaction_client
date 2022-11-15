"use strict";
// demo/mint.account.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const BufferLayout = __importStar(require("@solana/buffer-layout"));
let connection = new web3_js_1.Connection("http://api.mainnet-beta.solana.com", "confirmed");
;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let usdc = new web3_js_1.PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
        let usdcAcctInfo = yield connection.getAccountInfo(usdc);
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
        let mintAuthorityCoption = usdcAcctInfo.data.readUIntLE(0, 4);
        console.log("\n Mint_Authority_Coption value is");
        console.log(mintAuthorityCoption);
        // Decode next 32 bytes to a PublicKey based on the Mint Struct
        let mintAuthority = new web3_js_1.PublicKey(usdcAcctInfo.data.subarray(4, 36)).toBase58();
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
        console.log("Supply converted to a decimal");
        console.log(supply / (Math.pow(10, decimal)));
        // Decode the next 1 byte representing is_initialized field on Mint struct
        let isInitialized = usdcAcctInfo.data.readUIntLE(45, 1);
        console.log("\n is_initialized value is ");
        console.log(isInitialized);
        // Decode the next 36 bytes to obtain field freeze_authority COption and
        // PublicKey
        let freezeAuthorityCOption = usdcAcctInfo.data.readUIntLE(46, 4);
        console.log("\n freeze_Authority_COption value is");
        console.log(freezeAuthorityCOption);
        let freezeAuthority = new web3_js_1.PublicKey(usdcAcctInfo.data.subarray(50)).toBase58();
        console.log("\n Mint Authoriy Public Key is ");
        console.log(freezeAuthority);
    });
}
main().then(() => process.exit(), err => {
    console.error(err);
    process.exit(-1);
});
//# sourceMappingURL=mint.account.js.map