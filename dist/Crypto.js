"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crypto = void 0;
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
class Crypto {
    constructor(configuration) {
        this.configuration = configuration;
        if (this.keysExists()) {
            this.publicKey = fs_1.default.readFileSync(this.configuration.keypair.publicKeyPath, 'utf8').toString();
            this.privateKey = fs_1.default.readFileSync(this.configuration.keypair.privateKeyPath, 'utf8').toString();
        }
    }
    encrypt(toEncrypt) {
        const buffer = Buffer.from(toEncrypt, 'utf8');
        const encrypted = crypto_1.default.publicEncrypt(this.publicKey, buffer);
        return encrypted.toString('base64');
    }
    decrypt(toDecrypt) {
        const buffer = Buffer.from(toDecrypt, 'base64');
        const decrypted = crypto_1.default.privateDecrypt(this.privateKey, buffer);
        return decrypted.toString('utf8');
    }
    generateKeyPair() {
        const keyPair = crypto_1.default.generateKeyPairSync('rsa', {
            modulusLength: 4096
        });
        const options = {
            type: 'pkcs1',
            format: 'pem'
        };
        const publicKey = keyPair.publicKey.export(options).toString();
        const privateKey = keyPair.privateKey.export(options).toString();
        if (!fs_1.default.existsSync(this.configuration.keypair.path)) {
            fs_1.default.mkdirSync(this.configuration.keypair.path);
        }
        fs_1.default.writeFileSync(this.configuration.keypair.publicKeyPath, publicKey);
        fs_1.default.writeFileSync(this.configuration.keypair.privateKeyPath, privateKey);
    }
    keysExists() {
        return fs_1.default.existsSync(this.configuration.keypair.privateKeyPath) || fs_1.default.existsSync(this.configuration.keypair.publicKeyPath);
    }
}
exports.Crypto = Crypto;
//# sourceMappingURL=Crypto.js.map