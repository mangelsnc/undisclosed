#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const Crypto_1 = __importDefault(require("./Crypto"));
const Configuration_1 = __importDefault(require("./Configuration"));
const Output_1 = __importDefault(require("./Output"));
const Secret_1 = __importDefault(require("./Secret"));
const Key_1 = __importDefault(require("./Key"));
const args = process.argv;
const config = loadConfig();
const crypto = new Crypto_1.default(config);
const subcommand = args[2];
const commandHandler = {
    init: handleInit,
    'generate-keypair': handleGenerateKeyPair,
    list: handleList,
    set: handleSet,
    get: handleGet,
    dump: handleDump
};
if (commandHandler.hasOwnProperty(subcommand)) {
    commandHandler[subcommand]();
}
else {
    Output_1.default.log("Usage: undisclosed [init|generate-keypair|list|set|get|dump]\n");
}
process.exit(0);
function encryptedFileExists() {
    return fs_1.default.existsSync(config.encryptedDataPath);
}
function loadSecrets() {
    let data = fs_1.default.readFileSync(config.encryptedDataPath).toString();
    const secrets = [];
    data.split("\n").forEach(line => {
        if (!line) {
            return;
        }
        const lineArray = line.split('=');
        secrets.push(new Secret_1.default(lineArray[0], lineArray[1]));
    });
    return secrets;
}
function handleInit() {
    if (!fs_1.default.existsSync(process.env.PWD + '/undisclosed.conf.json')) {
        const defaultConfig = new Configuration_1.default(process.env.PWD + '/secrets');
        fs_1.default.writeFileSync(process.env.PWD + '/undisclosed.conf.json', JSON.stringify(defaultConfig.toJSON(), null, 2));
    }
    const config = loadConfig();
    if (!fs_1.default.existsSync(config.keypair.path)) {
        fs_1.default.mkdirSync(config.keypair.path);
    }
    Output_1.default.log("Undisclosed initialized.\n");
}
function handleGenerateKeyPair() {
    if (crypto.keysExists()) {
        Output_1.default.error("Keypair already exists. Remove it before generate new keypair.\n");
        process.exit(1);
    }
    crypto.generateKeyPair();
    const publicKey = fs_1.default.readFileSync(config.keypair.publicKeyPath, 'utf8').toString();
    const privateKey = fs_1.default.readFileSync(config.keypair.privateKeyPath, 'utf8').toString();
    const keyPair = [
        Key_1.default.createPublicKey(config.keypair.publicKeyPath, publicKey),
        Key_1.default.createPrivateKey(config.keypair.privateKeyPath, privateKey),
    ];
    Output_1.default.printKeyPair(keyPair);
}
function handleList() {
    if (!encryptedFileExists()) {
        Output_1.default.error("Secrets file not found.\n");
        process.exit(1);
    }
    const secrets = loadSecrets();
    Output_1.default.printSecrets(secrets);
}
function handleSet() {
    if (!crypto.keysExists()) {
        Output_1.default.log("Keypair not found, run before:\n\tundisclosed generate-keypair");
        process.exit(1);
    }
    const key = args[3];
    const value = args[4];
    const encryptedValue = crypto.encrypt(value);
    fs_1.default.appendFileSync(config.encryptedDataPath, key.toUpperCase() + '=' + encryptedValue + "\n");
    Output_1.default.printSecret(new Secret_1.default(key, encryptedValue));
}
function handleGet() {
    if (!encryptedFileExists()) {
        Output_1.default.error("Secrets file not found.\n");
        process.exit(1);
    }
    if (!crypto.keysExists()) {
        Output_1.default.log("Keypair not found, run before:\n\tundisclosed generate-keypair");
        process.exit(1);
    }
    const keyToFind = args[3].toUpperCase();
    loadSecrets().forEach(secret => {
        if (secret.key === keyToFind) {
            try {
                secret.value = crypto.decrypt(secret.value);
                Output_1.default.printSecret(secret);
            }
            catch (e) {
                Output_1.default.error('Something went wrong while decrypting ' + secret.key);
                process.exit(1);
            }
            process.exit(0);
        }
    });
    Output_1.default.error("Secret not found.\n");
}
function handleDump() {
    if (!encryptedFileExists()) {
        Output_1.default.error("Secrets file not found.\n");
        process.exit(1);
    }
    if (!crypto.keysExists()) {
        Output_1.default.log("Keypair not found, run before:\n\tundisclosed generate-keypair");
        process.exit(1);
    }
    const dumpedContent = [];
    loadSecrets().forEach(secret => {
        try {
            secret.value = crypto.decrypt(secret.value);
            dumpedContent.push(secret.key + '=' + secret.value);
        }
        catch (e) {
            Output_1.default.error('Something went wrong while decrypting ' + secret.key);
        }
    });
    if (dumpedContent.length > 0) {
        fs_1.default.writeFileSync(config.decryptedDataPath, dumpedContent.join("\n"));
        Output_1.default.log('Secrets dumped to: ' + config.decryptedDataPath + "\n");
    }
}
function loadConfig() {
    const configuration = new Configuration_1.default(process.env.PWD + '/secrets');
    configuration.loadConfigurationFromFile(process.env.PWD + '/undisclosed.conf.json');
    return configuration;
}
//# sourceMappingURL=index.js.map