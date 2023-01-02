"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class KeyPairConfiguration {
    constructor(path, privateKeyName, publicKeyName) {
        this.path = path;
        this.privateKeyName = privateKeyName;
        this.privateKeyPath = this.path + '/' + this.privateKeyName + '.pem';
        this.publicKeyName = publicKeyName;
        this.publicKeyPath = this.path + '/' + this.publicKeyName + '.pem';
    }
}
exports.default = KeyPairConfiguration;
//# sourceMappingURL=KeyPairConfiguration.js.map