"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Configuration = void 0;
const fs_1 = __importDefault(require("fs"));
const KeyPairConfiguration_1 = require("./KeyPairConfiguration");
class Configuration {
    constructor(path, privateKeyName = 'private', publicKeyName = 'public', defaultEnvironment = 'dev', encryptedDataPath = process.env.PWD + '/.env.enc', decryptedDataPath = process.env.PWD + '/.env') {
        this.keypair = new KeyPairConfiguration_1.KeyPairConfiguration(path, privateKeyName, publicKeyName);
        this.defaultEnvironment = defaultEnvironment;
        this.encryptedDataPath = encryptedDataPath;
        this.decryptedDataPath = decryptedDataPath;
    }
    loadConfigurationFromFile(path = process.env.PWD + '/undisclosed.conf.json') {
        if (!fs_1.default.existsSync(path)) {
            console.log('Nothing to load at ' + path);
            return;
        }
        const userConfig = JSON.parse(fs_1.default.readFileSync(path).toString());
        const keyPairPath = process.env.PWD + userConfig.keypair.path;
        this.keypair.path = keyPairPath;
        this.keypair.privateKeyPath = this.keypair.path + '/' + userConfig.keypair.privateKeyName + '.pem';
        this.keypair.publicKeyPath = this.keypair.path + '/' + userConfig.keypair.publicKeyName + '.pem';
    }
    toJSON() {
        return {
            keypair: {
                path: this.keypair.path,
                privateKeyName: this.keypair.privateKeyName,
                privateKeyPath: this.keypair.privateKeyPath,
                publicKeyName: this.keypair.publicKeyName,
                publicKeyPath: this.keypair.publicKeyPath
            },
            defaultEnvironment: this.defaultEnvironment,
            encryptedDataPath: this.encryptedDataPath,
            decryptedDataPath: this.decryptedDataPath,
        };
    }
}
exports.Configuration = Configuration;
//# sourceMappingURL=Configuration.js.map