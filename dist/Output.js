"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Output {
    static table(data) {
        console.table(data);
    }
    static printSecret(secret, truncate = true) {
        if (truncate) {
            secret.value = Output.truncate(secret.value);
        }
        Output.table([secret]);
    }
    static printSecrets(secrets, truncate = true) {
        if (truncate) {
            secrets.forEach(secret => { secret.value = Output.truncate(secret.value); });
        }
        Output.table(secrets);
    }
    static printKeyPair(keyPair) {
        keyPair.forEach(key => { key.value = Output.truncate(key.value); });
        Output.table(keyPair);
    }
    static log(message) {
        console.log(message);
    }
    static error(message) {
        console.error(message);
    }
    static truncate(string, limit = 20) {
        if (string.length <= limit) {
            return string;
        }
        return string.slice(0, limit) + '...';
    }
}
exports.default = Output;
//# sourceMappingURL=Output.js.map