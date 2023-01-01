#!/usr/bin/env node

import fs from 'fs';

import { Crypto } from './Crypto';
import { Configuration } from './Configuration';
import Output from './Output';

const args = process.argv;
const config = loadConfig();
const crypto = new Crypto(config);

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
    Output.log("Usage: undisclosed [init|generate-keypair|list|set|get|dump]\n")
}

process.exit(0);

function encryptedFileExists() {
    return fs.existsSync(config.encryptedDataPath);
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
            value: truncateValue ? Output.truncate(lineArray[1]) : lineArray[1]
        });
    });

    return dataArray;
}

function handleInit() {
    if (!fs.existsSync(process.env.PWD + '/undisclosed.conf.json')) {
      const defaultConfig = new Configuration(process.env.PWD + '/secrets');
      fs.writeFileSync(process.env.PWD + '/undisclosed.conf.json', JSON.stringify(defaultConfig.toJSON(), null, 2));
    }

    const config = loadConfig();

    if (!fs.existsSync(config.keypair.path)) {
        fs.mkdirSync(config.keypair.path);
    }

    Output.log("Undisclosed initialized.\n");
}

function handleGenerateKeyPair() {
    if (crypto.keysExists()) {
        Output.error("Keypair already exists. Remove it before generate new keypair.\n");

        process.exit(1);
    }

    crypto.generateKeyPair();

    const publicKey = fs.readFileSync(config.keypair.publicKeyPath, 'utf8').toString();
    const privateKey = fs.readFileSync(config.keypair.privateKeyPath, 'utf8').toString();

    const dataToShow = [
      { type: 'public', path: config.keypair.publicKeyPath, value: Output.truncate(publicKey) },
      { type: 'private', path: config.keypair.privateKeyPath, value: Output.truncate(privateKey) }
    ];

    Output.table(dataToShow);
}

function handleList() {
    if (!encryptedFileExists()) {
        Output.error("Secrets file not found.\n");
        process.exit(1);
    }

    const secrets = loadSecrets(true);
    Output.table(secrets);
}

function handleSet() {
    if (!crypto.keysExists()) {
        Output.log("Keypair not found, run before:\n\tundisclosed generate-keypair");
        process.exit(1);
    }

    const key = args[3];
    const value = args[4];
    const encryptedValue = crypto.encrypt(value);
    fs.appendFileSync(config.encryptedDataPath, key.toUpperCase() + '=' + encryptedValue + "\n");

    Output.table([
        { key: key.toUpperCase(), value: Output.truncate(encryptedValue) }
    ]);
}

function handleGet() {
    if (!encryptedFileExists()) {
        Output.error("Secrets file not found.\n");
        process.exit(1);
    }

    if (!crypto.keysExists()) {
        Output.log("Keypair not found, run before:\n\tundisclosed generate-keypair");
        process.exit(1);
    }

    const keyToFind = args[3].toUpperCase();
    loadSecrets().forEach(secret => {
        if (secret.key === keyToFind) {
            secret.value = crypto.decrypt(secret.value);
            Output.table([secret]);

            process.exit(0);
        }
    });

    Output.error("Secret not found.\n");
}

function handleDump() {
    if (!encryptedFileExists()) {
        Output.error("Secrets file not found.\n");
        process.exit(1);
    }

    if (!crypto.keysExists()) {
        Output.log("Keypair not found, run before:\n\tundisclosed generate-keypair");
        process.exit(1);
    }

    const dumpedContent = []
    loadSecrets().forEach(secret => {
        secret.value = crypto.decrypt(secret.value);
        dumpedContent.push(secret.key + '=' + secret.value);
    });

    fs.writeFileSync(config.decryptedDataPath, dumpedContent.join("\n"));

    Output.log('Secrets dumped to: ' + config.decryptedDataPath + "\n");
}

function loadConfig() {
  const configuration = new Configuration(process.env.PWD + '/secrets');
  configuration.loadConfigurationFromFile(process.env.PWD + '/undisclosed.conf.json');

  return configuration;
}
