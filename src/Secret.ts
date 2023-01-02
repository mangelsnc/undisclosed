export default class Secret {
  key: string;
  value: string;

  constructor(key: string, value: string) {
    this.key = key.toUpperCase();
    this.value = value;
  }
}
