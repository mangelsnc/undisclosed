import fs from 'fs';
import path from 'path';
import { KeyPairConfiguration } from './KeyPairConfiguration';

export class Configuration {
  keypair: KeyPairConfiguration;
  defaultEnvironment: string;
  encryptedDataPath: string;
  decryptedDataPath: string;

  constructor(
    path: string,
    privateKeyName: string = 'private',
    publicKeyName: string = 'public',
    defaultEnvironment: string = 'dev',
    encryptedDataPath: string = process.env.PWD + '/.env.enc',
    decryptedDataPath: string = process.env.PWD + '/.env'
  ) {
    this.keypair = new KeyPairConfiguration(path, privateKeyName, publicKeyName)
    this.defaultEnvironment = defaultEnvironment;
    this.encryptedDataPath = encryptedDataPath;
    this.decryptedDataPath = decryptedDataPath;
  }

  loadConfigurationFromFile(path: string = process.env.PWD + '/undisclosed.conf.json') {

    if (!fs.existsSync(path)) {
      return;
    }

    const userConfig:any = JSON.parse(fs.readFileSync(path).toString());
    const keyPairPath = process.env.PWD + '/' + userConfig.keypair.path;
    this.keypair.path = keyPairPath;
    this.keypair.privateKeyPath = this.keypair.path + '/' + userConfig.keypair.privateKeyName + '.pem';
    this.keypair.publicKeyPath = this.keypair.path + '/' + userConfig.keypair.publicKeyName + '.pem';
  }

  toJSON() {
    return {
      keypair: {
          path: path.basename(this.keypair.path),
          privateKeyName: this.keypair.privateKeyName,
          publicKeyName: this.keypair.publicKeyName,
      },
      defaultEnvironment: this.defaultEnvironment,
      encryptedDataPath: path.basename(this.encryptedDataPath),
      decryptedDataPath: path.basename(this.decryptedDataPath),
    }
  }
}
