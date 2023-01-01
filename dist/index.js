#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const Configuration_1 = require("./Configuration");
const args = process.argv;
const config = loadConfig();
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
    console.log("Usage: undisclosed [init|generate-keypair|list|set|get|dump]\n");
}
process.exit(0);
function encrypt(toEncrypt, publicKey) {
    const buffer = Buffer.from(toEncrypt, 'utf8');
    const encrypted = crypto_1.default.publicEncrypt(publicKey, buffer);
    return encrypted.toString('base64');
}
function decrypt(toDecrypt, privateKey) {
    const buffer = Buffer.from(toDecrypt, 'base64');
    const decrypted = crypto_1.default.privateDecrypt(privateKey, buffer);
    return decrypted.toString('utf8');
}
function keysExists() {
    return fs_1.default.existsSync(config.keypair.privateKeyPath) || fs_1.default.existsSync(config.keypair.publicKeyPath);
}
function encryptedFileExists() {
    return fs_1.default.existsSync(config.encryptedDataPath);
}
function generateKeyPair(publicKeyPath, privateKeyPath) {
    const keyPair = crypto_1.default.generateKeyPairSync('rsa', {
        modulusLength: 4096
    });
    const publicKey = keyPair.publicKey.export({
        type: 'pkcs1',
        format: 'pem'
    });
    const privateKey = keyPair.privateKey.export({
        type: 'pkcs1',
        format: 'pem'
    });
    fs_1.default.writeFileSync(publicKeyPath, publicKey);
    fs_1.default.writeFileSync(privateKeyPath, privateKey);
    const dataToShow = [
        { type: 'public', path: publicKeyPath, value: truncate(publicKey) },
        { type: 'private', path: privateKeyPath, value: truncate(privateKey) }
    ];
    console.table(dataToShow);
}
function truncate(string, limit = 20) {
    if (string.length <= limit) {
        return string;
    }
    return string.slice(0, limit) + '...';
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
            value: truncateValue ? truncate(lineArray[1]) : lineArray[1]
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
    console.log("Undisclosed initialized.\n");
}
function handleGenerateKeyPair() {
    if (keysExists()) {
        console.error("Keypair already exists. Remove it before generate new keypair.\n");
        process.exit(1);
    }
    generateKeyPair(config.keypair.publicKeyPath, config.keypair.privateKeyPath);
}
function handleList() {
    if (!encryptedFileExists()) {
        console.error("Secrets file not found.\n");
        process.exit(1);
    }
    const secrets = loadSecrets(true);
    console.table(secrets);
}
function handleSet() {
    if (!keysExists()) {
        console.log("Keypair not found, run before:\n\tundisclosed generate-keypair");
        process.exit(1);
    }
    const publicKey = fs_1.default.readFileSync(config.keypair.publicKeyPath, 'utf8').toString();
    const key = args[3];
    const value = args[4];
    const encryptedValue = encrypt(value, publicKey);
    fs_1.default.appendFileSync(config.encryptedDataPath, key.toUpperCase() + '=' + encryptedValue + "\n");
    console.table([
        { key: key.toUpperCase(), value: truncate(encryptedValue) }
    ]);
}
function handleGet() {
    if (!encryptedFileExists()) {
        console.error("Secrets file not found.\n");
        process.exit(1);
    }
    if (!keysExists()) {
        console.log("Keypair not found, run before:\n\tundisclosed generate-keypair");
        process.exit(1);
    }
    const keyToFind = args[3].toUpperCase();
    const privateKey = fs_1.default.readFileSync(config.keypair.privateKeyPath, 'utf8').toString();
    loadSecrets().forEach(secret => {
        if (secret.key === keyToFind) {
            secret.value = decrypt(secret.value, privateKey);
            console.table([secret]);
            process.exit(0);
        }
    });
    console.error("Secret not found.\n");
}
function handleDump() {
    if (!encryptedFileExists()) {
        console.error("Secrets file not found.\n");
        process.exit(1);
    }
    if (!keysExists()) {
        console.log("Keypair not found, run before:\n\tundisclosed generate-keypair");
        process.exit(1);
    }
    const privateKey = fs_1.default.readFileSync(config.keypair.privateKeyPath, 'utf8').toString();
    const dumpedContent = [];
    loadSecrets().forEach(secret => {
        secret.value = decrypt(secret.value, privateKey);
        dumpedContent.push(secret.key + '=' + secret.value);
    });
    fs_1.default.writeFileSync(config.decryptedDataPath, dumpedContent.join("\n"));
    console.log('Secrets dumped to: ' + config.decryptedDataPath + "\n");
}
function loadConfig() {
    const configuration = new Configuration_1.Configuration(process.env.PWD + '/secrets');
    configuration.loadConfigurationFromFile(process.env.PWD + '/undisclosed.conf.json');
    return configuration;
}
//# sourceMappingURL=index.js.map