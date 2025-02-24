import { RequestHandler } from 'express';
import { join, sep } from 'path';
import { lookup } from 'mime-types';
import { latestPilets, storePilet } from '../pilets';
import { getPilet } from '../db';
import { PiletDb } from '../types';

function getDetails(rest: string) {
  const parts = rest.split('/');

  if (rest.startsWith('@')) {
    const id = parts.splice(0, 2).join('/');
    parts.unshift(id);
  }

  const id = parts.shift();
  const version = parts.shift();
  const file = parts.pop();
  const directory = parts.join('/');

  return [id, version, directory, file];
}

export const getFiles = (): RequestHandler => async (req, res, next) => {
  // (/@:org)?/:name/:version/((*/)?:file)?
  const { 0: rest = '' } = req.params;
  const [id, version, directory, file] = getDetails(rest);
  const pilet = await getPilet(id, version);

  if (!pilet) {
    res.status(404).send('Pilet not found!');
  } else if (file) {
    const path = join(directory, file).split(sep).join('/');
    const content = pilet.files[path];

    if (content) {
      const bufferContent = Buffer.from(pilet.files[path]);
      const tenYears = 24 * 60 * 60 * 365 * 10;

      res
        .header('Cache-Control', `public, max-age=${tenYears}`)
        .contentType(lookup(file) || 'application/octet-stream')
        .status(200)
        .send(bufferContent);
    } else {
      if (file.indexOf('.') !== -1) {
        res.status(404).send('File not found!');
      } else {
        next();
      }
    }
  } else {
    res.status(200).json({
      items: Object.keys(pilet.files),
    });
  }
};

export const getLatestPilets = (): RequestHandler => async (_, res) => {
  const items = await latestPilets();
  return res.json({
    items: items.map(({ author: _0, license: _1, description: _2, ...item }) => item),
  });
};

export interface SnapshotApi {
  read(db: PiletDb): Promise<void>;
  update(db: PiletDb): Promise<void>;
}

export const publishPilet =
  (rootUrl: string, snapshot: SnapshotApi): RequestHandler =>
  (req, res) => {
    const bb = (req as any).busboy;

    if (bb) {
      req.pipe(bb);

      bb.on('file', (_: any, file: NodeJS.ReadableStream) =>
        storePilet(file, rootUrl)
          .then(snapshot.update)
          .then(() =>
            res.status(200).json({
              success: true,
            }),
          )
          .catch((err) =>
            res.status(err.message?.indexOf('already exists') !== -1 ? 409 : 400).json({
              success: false,
              message: err.message,
            }),
          ),
      );
    } else {
      res.status(400).json({
        success: false,
        message: 'Missing file upload.',
      });
    }
  };
