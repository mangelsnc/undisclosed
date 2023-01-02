"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const KeyPairConfiguration_1 = __importDefault(require("./KeyPairConfiguration"));
class Configuration {
    constructor(path, privateKeyName = 'private', publicKeyName = 'public', defaultEnvironment = 'dev', encryptedDataPath = process.env.PWD + '/.env.enc', decryptedDataPath = process.env.PWD + '/.env') {
        this.keypair = new KeyPairConfiguration_1.default(path, privateKeyName, publicKeyName);
        this.defaultEnvironment = defaultEnvironment;
        this.encryptedDataPath = encryptedDataPath;
        this.decryptedDataPath = decryptedDataPath;
    }
    loadConfigurationFromFile(path = process.env.PWD + '/undisclosed.conf.json') {
        if (!fs_1.default.existsSync(path)) {
            return;
        }
        const userConfig = JSON.parse(fs_1.default.readFileSync(path).toString());
        const keyPairPath = process.env.PWD + '/' + userConfig.keypair.path;
        this.keypair.path = keyPairPath;
        this.keypair.privateKeyPath = this.keypair.path + '/' + userConfig.keypair.privateKeyName + '.pem';
        this.keypair.publicKeyPath = this.keypair.path + '/' + userConfig.keypair.publicKeyName + '.pem';
    }
    toJSON() {
        return {
            keypair: {
                path: path_1.default.basename(this.keypair.path),
                privateKeyName: this.keypair.privateKeyName,
                publicKeyName: this.keypair.publicKeyName,
            },
            defaultEnvironment: this.defaultEnvironment,
            encryptedDataPath: path_1.default.basename(this.encryptedDataPath),
            decryptedDataPath: path_1.default.basename(this.decryptedDataPath),
        };
    }
}
exports.default = Configuration;
//# sourceMappingURL=Configuration.js.map