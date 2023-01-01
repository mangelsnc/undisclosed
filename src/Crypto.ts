import fs from 'fs';
import crypto from 'crypto';
import { JwkKeyExportOptions } from 'crypto';

import { Configuration } from './Configuration'

export class Crypto {
  readonly configuration: Configuration;
  readonly publicKey: string;
  readonly privateKey: string;

  constructor(configuration: Configuration) {
    this.configuration = configuration;

    if (this.keysExists()) {
      this.publicKey = fs.readFileSync(this.configuration.keypair.publicKeyPath, 'utf8').toString();
      this.privateKey = fs.readFileSync(this.configuration.keypair.privateKeyPath, 'utf8').toString();
    }
  }

  encrypt(toEncrypt): string {
    const buffer = Buffer.from(toEncrypt, 'utf8');
    const encrypted = crypto.publicEncrypt(this.publicKey, buffer);

    return encrypted.toString('base64');
  }

  decrypt(toDecrypt): string {
    const buffer = Buffer.from(toDecrypt, 'base64');
    const decrypted = crypto.privateDecrypt(this.privateKey, buffer);

    return decrypted.toString('utf8');
  }

  generateKeyPair() {
    const keyPair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096
    });
    const options: any = {
      type: 'pkcs1',
      format: 'pem'
    };

    const publicKey: string = keyPair.publicKey.export(options).toString();
    const privateKey: string = keyPair.privateKey.export(options).toString();

    if (!fs.existsSync(this.configuration.keypair.path)) {
      fs.mkdirSync(this.configuration.keypair.path);
    }

    fs.writeFileSync(this.configuration.keypair.publicKeyPath, publicKey);
    fs.writeFileSync(this.configuration.keypair.privateKeyPath, privateKey);
  }

  keysExists() {
    return fs.existsSync(this.configuration.keypair.privateKeyPath) || fs.existsSync(this.configuration.keypair.publicKeyPath);
  }
}
