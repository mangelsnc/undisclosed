import { Configuration } from './Configuration';
export declare class Crypto {
    readonly configuration: Configuration;
    readonly publicKey: string;
    readonly privateKey: string;
    constructor(configuration: Configuration);
    encrypt(toEncrypt: any): string;
    decrypt(toDecrypt: any): string;
    generateKeyPair(): void;
    keysExists(): boolean;
}
