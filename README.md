# :speak_no_evil: secrets-js

Simple CLI tool to handle encrypted secrets, heavily inspired in [Symfony Secrets](https://symfony.com/doc/current/configuration/secrets.html).

With `undisclosed` you can set and store your credentials encrypted, and dump it in plain whenever you want.

## generate-keypair
With `undisclosed generate-keypair` you will generate your keypair. It will be used to encrypt all your data.

**:warning: CAUTION:** Never commit your private key files to a version control system.

![Output of generate-keypair command](docs/assets/generate-keypair.png "Output of generate-keypair command")

## list
With `undisclosed list` you can list the secrets you previously stored.

![Output of list command](docs/assets/list.png "Output of list command")

## set
With `undisclosed set KEY value` you can store a new secret.

![Output of set command](docs/assets/set.png "Output of set command")

## get
With `undisclosed get KEY` you can retrieve a secret value.

![Output of get command](docs/assets/get.png "Output of get command")

## dump
With `undisclosed dump` you can dump all the stored secrets decrypted into a `.env` file.
