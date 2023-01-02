import Key from './Key'
import Secret from './Secret'

export default class Output {
  private static table(data) {
    console.table(data);
  }

  static printSecret(secret: Secret, truncate: boolean = true) {
    if (truncate) {
      secret.value = Output.truncate(secret.value);
    }

    Output.table([secret]);
  }

  static printSecrets(secrets: Array<Secret>, truncate: boolean = true) {
      if (truncate) {
        secrets.forEach(secret => { secret.value = Output.truncate(secret.value) });
      }

      Output.table(secrets);
    }

  static printKeyPair(keyPair: Array<Key>) {
    keyPair.forEach(key => { key.value = Output.truncate(key.value) });
    Output.table(keyPair);
  }

  static log(message: string) {
    console.log(message);
  }

  static error(message: string) {
    console.error(message);
  }

  static truncate(string: string, limit: number = 20) {
    if (string.length <= limit) {
      return string;
    }

    return string.slice(0, limit) + '...'
  }
}
