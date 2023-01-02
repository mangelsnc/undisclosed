import Key from './Key';
import Secret from './Secret';
export default class Output {
    private static table;
    static printSecret(secret: Secret, truncate?: boolean): void;
    static printSecrets(secrets: Array<Secret>, truncate?: boolean): void;
    static printKeyPair(keyPair: Array<Key>): void;
    static log(message: string): void;
    static error(message: string): void;
    static truncate(string: string, limit?: number): string;
}
