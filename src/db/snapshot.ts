import { dirname, resolve } from 'path';
import { existsSync } from 'fs';
import { mkdir, readFile, readdir, stat, writeFile } from 'fs/promises';
import { PiletDb } from '../types';

async function readJson(path: string) {
  try {
    const content = await readFile(path, 'utf8');
    return JSON.parse(content);
  } catch {
    // let's just ignore it - maybe the file does not exist
  }

  return undefined;
}

async function readdirSyncRecursive(dir: string) {
  const files = await readdir(dir);
  const result: Array<string> = [];

  for (const file of files) {
    const path = resolve(dir, file);
    const s = await stat(path);

    if (s.isFile()) {
      result.push(file);
    } else if (s.isDirectory()) {
      const subfiles = await readdirSyncRecursive(path);
      result.push(...subfiles.map((subfile) => `${file}/${subfile}`));
    }
  }

  return result;
}

function getSnapshotDbFileName(snapshotDir: string) {
  return resolve(process.cwd(), snapshotDir, 'db.json');
}

function getSnapshotPiletMetaFileName(snapshotDir: string, name: string, version: string) {
  return resolve(process.cwd(), snapshotDir, name, `${version}.json`);
}

function getSnapshotPiletRootName(snapshotDir: string, name: string, version: string) {
  return resolve(process.cwd(), snapshotDir, name, version);
}

async function readSnapshotPiletFiles(snapshotDir: string, name: string, version: string) {
  const dir = getSnapshotPiletRootName(snapshotDir, name, version);
  const files = await readdirSyncRecursive(dir);
  const result: Record<string, Buffer> = {};

  for (const file of files) {
    result[file] = await readFile(resolve(dir, file));
  }

  return result;
}

async function readPiletsFromSnapshot(snapshotDir: string): Promise<Record<string, string>> {
  const path = getSnapshotDbFileName(snapshotDir);
  return (await readJson(path)) || {};
}

export function useSnapshot(snapshotDir: string) {
  if (snapshotDir) {
    return {
      async read(piletData: PiletDb) {
        const pilets = await readPiletsFromSnapshot(snapshotDir);

        for (const [name, version] of Object.entries(pilets)) {
          const path = getSnapshotPiletMetaFileName(snapshotDir, name, version);
          const meta = (await readJson(path)) || {};

          piletData[name] = {
            current: version,
            versions: {
              [version]: {
                meta,
                files: await readSnapshotPiletFiles(snapshotDir, name, version),
              },
            },
          };
        }
      },
      async update(piletData: PiletDb) {
        const path = getSnapshotDbFileName(snapshotDir);
        const pilets = Object.entries(piletData).map(([name, value]) => [name, value.current]);

        const content = JSON.stringify(Object.fromEntries(pilets), undefined, 2);
        await mkdir(dirname(path), { recursive: true });
        await writeFile(path, content, 'utf8');

        for (const [name] of pilets) {
          const version = piletData[name].current;
          const meta = getSnapshotPiletMetaFileName(snapshotDir, name, version);

          if (!existsSync(meta)) {
            const root = getSnapshotPiletRootName(snapshotDir, name, version);
            const data = piletData[name].versions[version];
            const content = JSON.stringify(data.meta, undefined, 2);
            const dirs = [root];
            const files = [[meta, Buffer.from(content, 'utf8')]];

            for (const [file, buffer] of Object.entries(data.files)) {
              const fn = resolve(root, file);
              const dir = dirname(fn);

              files.push([file, buffer]);

              if (!dirs.includes(dir)) {
                dirs.push(dir);
              }
            }

            for (const dir of dirs) {
              await mkdir(dir, { recursive: true });
            }

            for (const [file, buffer] of files) {
              await writeFile(file, buffer);
            }
          }
        }
      },
    };
  }

  return {
    async read() {},
    async update() {},
  };
}
