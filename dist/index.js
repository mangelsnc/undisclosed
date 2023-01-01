#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const Crypto_1 = require("./Crypto");
const Configuration_1 = require("./Configuration");
const Output_1 = __importDefault(require("./Output"));
const args = process.argv;
const config = loadConfig();
const crypto = new Crypto_1.Crypto(config);
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
function loadSecrets(truncateValue = false) {
    let data = fs_1.default.readFileSync(config.encryptedDataPath).toString();
    const dataArray = [];
    data.split("\n").forEach(line => {
        if (!line) {
            return;
        }
        const lineArray = line.split('=');
        dataArray.push({
            key: lineArray[0],
            value: truncateValue ? Output_1.default.truncate(lineArray[1]) : lineArray[1]
        });
    });
    return dataArray;
}
function handleInit() {
    if (!fs_1.default.existsSync(process.env.PWD + '/undisclosed.conf.json')) {
        const defaultConfig = new Configuration_1.Configuration(process.env.PWD + '/secrets');
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
    const dataToShow = [
        { type: 'public', path: config.keypair.publicKeyPath, value: Output_1.default.truncate(publicKey) },
        { type: 'private', path: config.keypair.privateKeyPath, value: Output_1.default.truncate(privateKey) }
    ];
    Output_1.default.table(dataToShow);
}
function handleList() {
    if (!encryptedFileExists()) {
        Output_1.default.error("Secrets file not found.\n");
        process.exit(1);
    }
    const secrets = loadSecrets(true);
    Output_1.default.table(secrets);
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
    Output_1.default.table([
        { key: key.toUpperCase(), value: Output_1.default.truncate(encryptedValue) }
    ]);
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
            secret.value = crypto.decrypt(secret.value);
            Output_1.default.table([secret]);
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
        secret.value = crypto.decrypt(secret.value);
        dumpedContent.push(secret.key + '=' + secret.value);
    });
    fs_1.default.writeFileSync(config.decryptedDataPath, dumpedContent.join("\n"));
    Output_1.default.log('Secrets dumped to: ' + config.decryptedDataPath + "\n");
}
function loadConfig() {
    const configuration = new Configuration_1.Configuration(process.env.PWD + '/secrets');
    configuration.loadConfigurationFromFile(process.env.PWD + '/undisclosed.conf.json');
    return configuration;
}
//# sourceMappingURL=index.js.map