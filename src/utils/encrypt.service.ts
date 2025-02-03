import { Injectable } from "@nestjs/common";
import * as CryptoJs from "crypto-js";

Injectable()
export class EncryptionService {
    private readonly algorithm = 'aes-256-cbc';
    private readonly key = "tms-backend";

    encryptData(data: string){
        let encUrl = CryptoJs.AES.encrypt(data, this.key).toString();
        return 'https://'+encUrl 
    }
}