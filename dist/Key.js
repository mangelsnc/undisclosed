"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var KeyType;
(function (KeyType) {
    KeyType[KeyType["public"] = 0] = "public";
    KeyType[KeyType["private"] = 1] = "private";
})(KeyType || (KeyType = {}));
class Key {
    constructor(type, path, value) {
        this.type = type;
        this.path = path;
        this.value = value;
    }
    static createPublicKey(path, value) {
        return new Key(KeyType.public, path, value);
    }
    static createPrivateKey(path, value) {
        return new Key(KeyType.private, path, value);
    }
}
exports.default = Key;
//# sourceMappingURL=Key.js.map