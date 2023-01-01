import fs from 'fs';
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
      console.log('Nothing to load at ' + path);
      return;
    }

    const userConfig:any = JSON.parse(fs.readFileSync(path).toString());
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
    }
  }
}
