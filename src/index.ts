#!/usr/bin/env node

import fs from 'fs';
import crypto from 'crypto';
import { Configuration } from './Configuration';

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
}

if (commandHandler.hasOwnProperty(subcommand)) {
    commandHandler[subcommand]();
} else {
    console.log("Usage: undisclosed [init|generate-keypair|list|set|get|dump]\n")
}

process.exit(0);

function encrypt(toEncrypt, publicKey) {
    const buffer = Buffer.from(toEncrypt, 'utf8');
    const encrypted = crypto.publicEncrypt(publicKey, buffer);

    return encrypted.toString('base64');
}

function decrypt(toDecrypt, privateKey) {
    const buffer = Buffer.from(toDecrypt, 'base64');
    const decrypted = crypto.privateDecrypt(privateKey, buffer);

    return decrypted.toString('utf8');
}

function keysExists() {
    return fs.existsSync(config.keypair.privateKeyPath) || fs.existsSync(config.keypair.publicKeyPath);
}

function encryptedFileExists() {
    return fs.existsSync(config.encryptedDataPath);
}

function generateKeyPair(publicKeyPath, privateKeyPath) {
    const keyPair = crypto.generateKeyPairSync('rsa', {
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

    fs.writeFileSync(publicKeyPath, publicKey);
    fs.writeFileSync(privateKeyPath, privateKey);

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

    return string.slice(0, limit) + '...'
}

function loadSecrets(truncateValue = false) {
    let data:string = fs.readFileSync(config.encryptedDataPath).toString();
    const dataArray:Array<any> = [];

    data.split("\n").forEach(line => {
        if (!line) {
            return
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
    if (!fs.existsSync(process.env.PWD + '/undisclosed.conf.json')) {
        fs.copyFileSync(__dirname + '/config/default.json', process.env.PWD + '/undisclosed.conf.json');
    }

    const config = loadConfig();

    if (!fs.existsSync(config.keypair.path)) {
        fs.mkdirSync(config.keypair.path);
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

    const publicKey = fs.readFileSync(config.keypair.publicKeyPath, 'utf8').toString();
    const key = args[3];
    const value = args[4];
    const encryptedValue = encrypt(value, publicKey);
    fs.appendFileSync(config.encryptedDataPath, key.toUpperCase() + '=' + encryptedValue + "\n");

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
    const privateKey = fs.readFileSync(config.keypair.privateKeyPath, 'utf8').toString();
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

    const privateKey = fs.readFileSync(config.keypair.privateKeyPath, 'utf8').toString();
    const dumpedContent = []
    loadSecrets().forEach(secret => {
        secret.value = decrypt(secret.value, privateKey);
        dumpedContent.push(secret.key + '=' + secret.value);
    });

    fs.writeFileSync(config.decryptedDataPath, dumpedContent.join("\n"));

    console.log('Secrets dumped to: ' + config.decryptedDataPath + "\n");
}

function loadConfig() {
  const configuration = new Configuration(process.env.PWD + '/secrets');
  configuration.loadConfigurationFromFile(process.env.PWD + '/undisclosed.conf.json');

  return configuration;
}
