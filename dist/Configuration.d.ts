import KeyPairConfiguration from './KeyPairConfiguration';
export default class Configuration {
    keypair: KeyPairConfiguration;
    defaultEnvironment: string;
    encryptedDataPath: string;
    decryptedDataPath: string;
    constructor(path: string, privateKeyName?: string, publicKeyName?: string, defaultEnvironment?: string, encryptedDataPath?: string, decryptedDataPath?: string);
    loadConfigurationFromFile(path?: string): void;
    toJSON(): {
        keypair: {
            path: string;
            privateKeyName: string;
            publicKeyName: string;
        };
        defaultEnvironment: string;
        encryptedDataPath: string;
        decryptedDataPath: string;
    };
}
