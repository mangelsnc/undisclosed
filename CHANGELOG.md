# CHANGELOG
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.3.2] -  2026-06-15
### Fixed
- Republish the v2.3.0 contents to npm. The 2.3.0 release was tagged on GitHub but never reached npm because the release workflow ran via `workflow_dispatch`, which is incompatible with npm Trusted Publishing (npm validates the calling workflow, not the file with `npm publish`, and rejects with a 404).
- Stop passing `registry-url` to `actions/setup-node` in the release job. With `registry-url` set, setup-node writes an `.npmrc` that injects a placeholder `NODE_AUTH_TOKEN` into every step, which `npm publish` then prefers over the OIDC token, producing another spurious 404. With `registry-url` removed, npm 10 performs the OIDC handshake against `registry.npmjs.org` directly and Trusted Publishing works.

### Changed
- Release workflow now triggers on `push: tags: '[0-9]+.[0-9]+.[0-9]+'` instead of push-to-main. The tag is the source of truth for the release; the workflow verifies it matches `package.json` `version` before doing anything.
- Restore the historical git tag naming convention: tags are plain semver (`2.3.2`), not prefixed with `v`. This matches `1.0.0` through `2.2.0` and is what the new tag trigger expects.

### Removed
- `workflow_dispatch` trigger and `force_publish` input on the release workflow. The trigger was incompatible with npm Trusted Publishing; the new tag-driven flow makes it unnecessary.

## [2.3.0] -  2026-06-15
### Fixed
- Require both public and private key files to be present before reporting the keypair as available.
- Validate required CLI arguments for `set`, `get`, and `delete` and print a usage hint instead of crashing.
- Create the keypair directory recursively so multi-level paths work.
- Pin RSA padding to OAEP-SHA1 explicitly; matches the historical Node default and prevents future Node default changes from breaking existing secrets.
- Write the private key file with `0o600` permissions on generation.
- Replace `process.env.PWD` with `process.cwd()` for portability (Windows, non-shell invocations).

### Added
- `init` now adds `.env` to the project root `.gitignore` so dumped secrets cannot be committed by accident.
- GitHub Actions workflow `ci.yml` runs lint, build, and tests on every pull request.
- GitHub Actions workflow `release.yml` auto-tags, releases, and publishes to npm whenever `main` advances and `package.json` `version` does not yet have a matching git tag. The release job uses Node 20 and npm Trusted Publishing (OIDC) with provenance; it supports a `force_publish` manual dispatch input to republish a version without re-tagging.

### Removed
- `npm-publish.yml` workflow (replaced by `release.yml`).
- `NPM_TOKEN` secret is no longer needed; the workflow authenticates to npm via OIDC.

## [2.2.0] -  2023-01-05
### Added
- Add .gitignore entry to avoid synchronize public and private key with repo.

## [2.1.0] -  2023-01-04
### Added
- Add support to delete secrets.

## [2.0.0] -  2023-01-04
### Added
- Add support to update secrets. I changed the way I store secrets, so this version is BC with previous.

## [1.2.0] - 2023-01-03

### Changed
- Refactor code to use TypeScript

## [1.1.0] - 2022-12-06

### Added
- Add configuration via JSON file

## [1.0.0] - 2022-12-06

### Added
- First usable version
