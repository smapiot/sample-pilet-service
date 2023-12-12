import { resolve } from 'path';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { snapshotDir } from '../constants';
import { PiletDb } from './types';

function readJson(path: string) {
  try {
    const content = readFileSync(path, 'utf8');
    return JSON.parse(content);
  } catch {
    // let's just ignore it - maybe the file does not exist
  }

  return undefined;
}

function readdirSyncRecursive(dir: string) {
  const files = readdirSync(dir);
  const result: Array<string> = [];

  for (const file of files) {
    const path = resolve(dir, file);
    const stat = statSync(path);

    if (stat.isFile()) {
      result.push(file);
    } else if (stat.isDirectory()) {
      const subfiles = readdirSyncRecursive(path);
      result.push(...subfiles.map((subfile) => `${file}/${subfile}`));
    }
  }

  return result;
}

function getSnapshotDbFileName() {
  return resolve(process.cwd(), snapshotDir, 'db.json');
}

function getSnapshotPiletMetaFileName(name: string, version: string) {
  return resolve(process.cwd(), snapshotDir, name, `${version}.json`);
}

function getSnapshotPiletRootName(name: string, version: string) {
  return resolve(process.cwd(), snapshotDir, name, version);
}

function readSnapshotPiletFiles(name: string, version: string) {
  const dir = getSnapshotPiletRootName(name, version);
  const files = readdirSyncRecursive(dir);
  const result: Record<string, Buffer> = {};

  for (const file of files) {
    result[file] = readFileSync(resolve(dir, file));
  }

  return result;
}

function readPiletsFromSnapshot(): Record<string, string> {
  if (snapshotDir) {
    const path = getSnapshotDbFileName();
    return readJson(path) || {};
  }

  return {};
}

export function readFromSnapshot(piletData: PiletDb) {
  const pilets = readPiletsFromSnapshot();

  for (const [name, version] of Object.entries(pilets)) {
    const path = getSnapshotPiletMetaFileName(name, version);
    const meta = readJson(path) || {};

    piletData[name] = {
      current: version,
      versions: {
        [version]: {
          meta,
          files: readSnapshotPiletFiles(name, version),
        },
      },
    };
  }
}

export function updateSnapshot(piletData: PiletDb) {
  if (snapshotDir) {
    const path = getSnapshotDbFileName();
    const pilets = Object.entries(piletData).map(([name, value]) => [name, value.current]);

    const content = JSON.stringify(Object.fromEntries(pilets), undefined, 2);
    writeFileSync(path, content, 'utf8');

    for (const [name] of pilets) {
      const version = piletData[name].current;
      const meta = getSnapshotPiletMetaFileName(name, version);

      if (!existsSync(meta)) {
        const root = getSnapshotPiletRootName(name, version);
        const data = piletData[name].versions[version];
        const content = JSON.stringify(data.meta, undefined, 2);
        writeFileSync(path, content, 'utf8');
        mkdirSync(root, { recursive: true });
        Object.entries(data.files).forEach(([file, buffer]) => {
          writeFileSync(resolve(root, file), buffer);
        });
      }
    }
  }
}
