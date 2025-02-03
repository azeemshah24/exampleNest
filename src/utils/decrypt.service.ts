import { Injectable } from "@nestjs/common";
import * as CryptoJs from "crypto-js";

Injectable()
export class DecryptionService {
    private readonly algorithm = 'aes-256-cbc';
    private readonly key = "lms-backend";

    dencryptData(data: string){
        let dencUrl = CryptoJs.AES.decrypt(data.replace("https://", ""), this.key);
        return dencUrl.toString(CryptoJs.enc.Utf8);
    }
}