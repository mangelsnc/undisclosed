# :speak_no_evil: undisclosed

Simple CLI tool to handle encrypted secrets, heavily inspired in [Symfony Secrets](https://symfony.com/doc/current/configuration/secrets.html).

With `undisclosed` you can set and store your credentials encrypted, and dump it in plain whenever you want.

## generate-keypair
With `undisclosed generate-keypair` you will generate your keypair. It will be used to encrypt all your data.

**:warning: CAUTION:** Never commit your private key files to a version control system.

```
$ undisclosed generate-keypair
┌─────────┬───────────┬────────────────────────────────────────────┬───────────────────────────┐
│ (index) │   type    │                    path                    │           value           │
├─────────┼───────────┼────────────────────────────────────────────┼───────────────────────────┤
│    0    │ 'public'  │ '/Users/mangel/Workspace/test/public.pem'  │ '-----BEGIN RSA PUBLI...' │
│    1    │ 'private' │ '/Users/mangel/Workspace/test/private.pem' │ '-----BEGIN RSA PRIVA...' │
└─────────┴───────────┴────────────────────────────────────────────┴───────────────────────────┘
```

## list
With `undisclosed list` you can list the secrets you previously stored.

```
$ undisclosed list
┌─────────┬────────┬───────────────────────────┐
│ (index) │  key   │           value           │
├─────────┼────────┼───────────────────────────┤
│    0    │ 'USER' │ 'XdnN70UTz1adJZIVUcb1...' │
└─────────┴────────┴───────────────────────────┘
```

## set
With `undisclosed set KEY value` you can store a new secret.

```
$ undisclosed set USER root
┌─────────┬────────┬───────────────────────────┐
│ (index) │  key   │           value           │
├─────────┼────────┼───────────────────────────┤
│    0    │ 'USER' │ 'XdnN70UTz1adJZIVUcb1...' │
└─────────┴────────┴───────────────────────────┘
```

## get
With `undisclosed get KEY` you can retrieve a secret value.

```
$ undisclosed get USER
┌─────────┬────────┬────────┐
│ (index) │  key   │ value  │
├─────────┼────────┼────────┤
│    0    │ 'USER' │ 'root' │
└─────────┴────────┴────────┘
```

## dump
With `undisclosed dump` you can dump all the stored secrets decrypted into a `.env` file.
