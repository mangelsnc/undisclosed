export default class KeyPairConfiguration {
    path: string;
    privateKeyName: string;
    privateKeyPath: string;
    publicKeyName: string;
    publicKeyPath: string;
    constructor(path: string, privateKeyName: string, publicKeyName: string);
}
