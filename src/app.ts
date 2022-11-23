import * as express from 'express';
import * as responseTime from 'response-time';
import * as cors from 'cors';
import * as busboy from 'connect-busboy';
import { defaultKeys } from './auth';
import { withGql } from './resolvers';
import { checkAuth, checkAuthRequestId } from './middleware';
import {
  getAuthStatus,
  createAuthRequest,
  getFiles,
  publishPilet,
  getLatestPilets,
  getLoginPage,
  finishLogin,
} from './endpoints';
import {
  defaultAuthPath,
  defaultPiletPath,
  defaultFilePath,
  defaultPort,
  defaultProtocol,
  defaultLoginPath,
} from './constants';

function getUrl(port: number) {
  const protocol = process.env.HTTP_X_FORWARDED_PROTO || defaultProtocol;
  const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;
  return `${protocol}://${host}`;
}

export interface AppOptions {
  piletPath?: string;
  authPath?: string;
  loginPath?: string;
  filePath?: string;
  rootUrl?: string;
  apiKeys?: Array<string>;
  port?: number;
}

export async function runApp({
  filePath = defaultFilePath,
  piletPath = defaultPiletPath,
  authPath = defaultAuthPath,
  loginPath = defaultLoginPath,
  port = defaultPort,
  apiKeys = defaultKeys,
  rootUrl = getUrl(port),
}: AppOptions = {}) {
  const app = express();
  const authUrl = `${rootUrl}${authPath}`;
  const loginUrl = `${rootUrl}${loginPath}`;

  app.use(
    cors({
      origin: '*',
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      optionsSuccessStatus: 200,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(responseTime());
  app.use(
    busboy({
      highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
      limits: {
        fileSize: 32 * 1024 * 1024, // Set 32MiB limit
      },
    }),
  );

  app.get(loginPath, checkAuthRequestId(), getLoginPage());

  app.post(loginPath, checkAuthRequestId(), finishLogin());

  app.get(authPath, checkAuthRequestId(), getAuthStatus(apiKeys));

  app.post(authPath, createAuthRequest(authUrl, loginUrl));

  app.get(piletPath, getLatestPilets());

  app.post(piletPath, checkAuth(apiKeys, authUrl, 'publish-pilet'), publishPilet(rootUrl));

  app.get(filePath, getFiles());

  await withGql(app);
  app.listen(port, () => {
    console.info(`Pilet feed fervice started on port ${port}.`);
    console.info(``);
    console.info(`  URL for uploading pilets:`);
    console.info(``);
    console.info(`    ${rootUrl}${piletPath}`);
    console.info(``);
    console.info(`  API keys for publishing:`);
    console.info(``);
    console.info(`    ${apiKeys.join('\n    ')}`);
    console.info(``);
  });
}
