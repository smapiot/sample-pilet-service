import { RequestHandler } from 'express';
import { join, relative, sep } from 'path';
import { lookup } from 'mime-types';
import { latestPilets, storePilet } from '../pilets';
import { getPilet } from '../db';

export const getFiles = (): RequestHandler => async (req, res) => {
  const { name, version, org, file } = req.params;
  const id = org ? `@${org}/${name}` : name;
  const pilet = await getPilet(id, version);

  if (!pilet) {
    res.status(404).send('Pilet not found!');
  } else if (file) {
    const path = join(pilet.root, file)
      .split(sep)
      .join('/');
    const content = pilet.files[path];

    if (content) {
      const tenYears = 24 * 60 * 60 * 365 * 10;

      res
        .header('Cache-Control', `public, max-age=${tenYears}`)
        .contentType(lookup(file) || 'application/octet-stream')
        .status(200)
        .send(content);
    } else {
      res.status(404).send('File not found!');
    }
  } else {
    const files = Object.keys(pilet.files)
      .map(m => relative(pilet.root, m))
      .filter(m => m.indexOf(sep) === -1);

    res.status(200).json({
      items: files,
    });
  }
};

export const getLatestPilets = (): RequestHandler => async (_, res) => {
  const items = await latestPilets();
  return res.json({
    items,
  });
};

export const publishPilet = (rootUrl: string): RequestHandler => (req, res) => {
  const bb = (req as any).busboy;

  if (bb) {
    req.pipe(bb);

    bb.on('file', (_: any, file: NodeJS.ReadableStream) =>
      storePilet(file, rootUrl)
        .then(() =>
          res.status(200).json({
            success: true,
          }),
        )
        .catch(err =>
          res.status(400).json({
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
