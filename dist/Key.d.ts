declare enum KeyType {
    public = 0,
    private = 1
}
export default class Key {
    type: KeyType;
    path: string;
    value: string;
    constructor(type: KeyType, path: string, value: string);
    static createPublicKey(path: string, value: string): Key;
    static createPrivateKey(path: string, value: string): Key;
}
export {};
