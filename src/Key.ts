enum KeyType {
  public,
  private
}

export default class Key {
  type: KeyType;
  path: string;
  value: string;

  constructor (type: KeyType, path: string, value: string) {
    this.type = type;
    this.path = path;
    this.value = value;
  }

  static createPublicKey(path: string, value: string) {
    return new Key(KeyType.public, path, value);
  }

  static createPrivateKey(path: string, value: string) {
    return new Key(KeyType.private, path, value);
  }
}
