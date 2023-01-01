export class KeyPairConfiguration {
  path: string;
  privateKeyName: string;
  privateKeyPath: string;
  publicKeyName: string;
  publicKeyPath: string;

  constructor(
    path: string,
    privateKeyName: string,
    publicKeyName: string
  ) {
    this.path = path;
    this.privateKeyName = privateKeyName;
    this.privateKeyPath = this.path + '/' + this.privateKeyName + '.pem';
    this.publicKeyName = publicKeyName;
    this.publicKeyPath = this.path + '/' + this.publicKeyName + '.pem';
  }
}
