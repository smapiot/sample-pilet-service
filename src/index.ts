import * as express from 'express';
import * as responseTime from 'response-time';
import * as cors from 'cors';
import * as busboy from 'connect-busboy';
import { piletPath, filePath, port } from './constants';
import { checkAuth } from './middleware';
import { withGql } from './resolvers';
import { getFiles, publishPilet, getLatestPilets } from './endpoints';

const app = express();

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

app.get(piletPath, getLatestPilets);

app.post(piletPath, checkAuth('publish-pilet'), publishPilet);

app.get(filePath, getFiles);

withGql(app).listen(port, () => {
  console.info(`Service started on port ${port}.`);
});
