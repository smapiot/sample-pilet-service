[![Piral Logo](https://github.com/smapiot/piral/raw/master/docs/assets/logo.png)](https://piral.io)

# [Sample Pilet Feed](https://piral.io) &middot; [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/smapiot/piral/blob/master/LICENSE) [![GitHub Tag](https://img.shields.io/github/tag/smapiot/piral.svg)](https://github.com/smapiot/piral/releases) [![Gitter Chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/piral-io/community)

A simple Node.js sample pilet feed service for use with Piral.

## Getting Started

For running this sample locally all you need to do is running:

```sh
npm i && npm start
```

**Remark**: This sample requires Node.js and NPM. The used port is `9000`, which could be re-configured easily (e.g., via an environment variable `PORT`).

## Auth Keys

For publishing a Pilet a handful premade keys have been added (file: `src/auth/keys.ts`):

```plain
df133a512569cbc85f69788d1b7ff5a909f6bcfe1c9a2794283a2fc35175882c
da91e6a8aeee998b7d6b0701486e4909d2ee14fbcc0af5de601c1d09982141d5
f94fa7067e0299679af2b1dda6f1835cd7ed03a43c104446954b11ec7b1509d0
edf8c9275873ca743394b3367e67149d6fda5306b577113fbf1ff4f191de69e4
ad647bdc23b7437b8fa8f27c3e2d3f70fbb493c53e9160e07d37a98df333b188
```

Either change the file when using this service in any non-local infrastructure or set the environment variable `PILET_API_KEYS` with comma separated values (e.g., `A,B,C` uses three keys `A`, `B`, and `C` instead).

## Pilet Database

For this simple sample everything is kept in memory. If you want to change this behavior to store the pilets also in a database / some storage you will need to modify the `src/db/index.ts` file.

**Remark**: The file has been prepared in such a sense that all exposed functions already return promises.

## Reported URL

For the pilets the reported URL is `http://localhost/...` unless changed via `src/constants.ts`. For simplicity, a resolution algorithm based on standard environment variables is already active.

| Variable               | Meaning                                                                         |
|------------------------|---------------------------------------------------------------------------------|
| WEBSITE_HOSTNAME       | The name of the host, e.g., `localhost`                                         |
| PORT                   | The port, otherwise falling back to 9000                                        |
| HTTPS                  | Is HTTPS active, otherwise falling back to HTTP                                 |
| HTTP_X_FORWARDED_PROTO | The used protocol (e.g., `http`), otherwise falling back to the `HTTPS` setting |

## License

Piral is released using the MIT license. For more information see the [license file](./LICENSE).
