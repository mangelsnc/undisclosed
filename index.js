#!/usr/bin/env node

const fs = require('fs');
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const args = process.argv;
const privateKeyPath = process.env.PWD + '/private.pem';
const publicKeyPath = process.env.PWD + '/public.pem';
const dataPath = process.env.PWD + '/.env.enc';

const subcommand = args[2];

switch(subcommand) {
    case 'generate-keypair':
        if (keysExists()) {
            rl.question("Keypair already exists. Do you wanna rewrite it? (Y/n)\n\nCRITICAL: All data encrypted before will be lost.\n\n", function(answer) {
                rl.close();

                if (answer.toUpperCase() != 'Y' && answer.toUpperCase != 'YES') {
                    process.exit();
                }

                generateKeyPair(privateKeyPath, publicKeyPath);
            })

        }

        process.exit();

        break;

    case 'set':
        if (!keysExists()) {
            console.log("Keypair not found, run before:\n\tsecrets generate-keypair");
            process.exit();
        }

        const publicKey = fs.readFileSync(publicKeyPath, 'utf8').toString();
        const key = args[3];
        const value = args[4];
        const encryptedValue = encrypt(value, publicKey);
        fs.appendFileSync(dataPath, key.toUpperCase() + '=' + encryptedValue + "\n");

        console.log(key.toUpperCase() + '=' + encryptedValue);

        process.exit();

        break;

    case 'view':
        // TODO: Decrypt and read variable
        process.exit();
        break;

    default:
        console.log("Usage: secrets [generate-keypair|set|view]")

        process.exit();

        break;
}


function encrypt(toEncrypt, publicKey) {
    const buffer = Buffer.from(toEncrypt,'utf8');
    const encrypted = crypto.publicEncrypt(publicKey, buffer);

    return encrypted.toString('base64');
}

function keysExists() {
    return fs.existsSync(privateKeyPath) || fs.existsSync(publicKeyPath);
}

function generateKeyPair(privateKeyPath, publicKeyPath) {
    const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096
    });

    fs.writeFileSync(publicKeyPath, keyPair.publicKey.export({
        type: 'pkcs1',
        format: 'pem'
    }));

    fs.writeFileSync(privateKeyPath, keyPair.privateKey.export({
        type: 'pkcs1',
        format: 'pem'
    }));

    console.log("Generated keypair:\n - " + privateKeyPath + "\n - " + publicKeyPath);
}
