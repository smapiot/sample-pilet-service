import { getPilets, setPilet, piletData } from '../db';
import { getPiletDefinition } from '../helpers';
import { PiletMetadata } from '../types';

function getPilet(pilet: PiletMetadata) {
  switch (pilet.type) {
    case 'v0':
      return {
        name: pilet.name,
        description: pilet.description,
        author: pilet.author,
        license: pilet.license,
        version: pilet.version,
        link: pilet.link,
        content: pilet.content,
        hash: pilet.hash,
        noCache: pilet.noCache,
        custom: pilet.custom,
        spec: 'v0',
      };
    case 'v1':
      return {
        name: pilet.name,
        description: pilet.description,
        author: pilet.author,
        license: pilet.license,
        version: pilet.version,
        link: pilet.link,
        requireRef: pilet.requireRef,
        integrity: pilet.integrity,
        custom: pilet.custom,
        spec: 'v1',
      };
    case 'v2':
      return {
        name: pilet.name,
        description: pilet.description,
        author: pilet.author,
        license: pilet.license,
        version: pilet.version,
        link: pilet.link,
        requireRef: pilet.requireRef,
        integrity: pilet.integrity,
        custom: pilet.custom,
        dependencies: pilet.dependencies,
        spec: 'v2',
      };
    case 'v3':
      return {
        name: pilet.name,
        description: pilet.description,
        author: pilet.author,
        license: pilet.license,
        version: pilet.version,
        link: pilet.link,
        requireRef: pilet.requireRef,
        integrity: pilet.integrity,
        custom: pilet.custom,
        dependencies: pilet.dependencies,
        spec: 'v3',
      };
    case 'mf':
      return {
        name: pilet.name,
        description: pilet.description,
        author: pilet.author,
        license: pilet.license,
        version: pilet.version,
        link: pilet.link,
        integrity: pilet.integrity,
        custom: pilet.custom,
        spec: 'mf',
      };
    case 'vx':
      return {
        name: pilet.name,
        description: pilet.description,
        author: pilet.author,
        license: pilet.license,
        version: pilet.version,
        link: pilet.link,
        integrity: pilet.integrity,
        custom: pilet.custom,
        spec: pilet.spec || 'vx',
      };
    default:
      return pilet;
  }
}

export async function latestPilets() {
  const pilets = await getPilets();
  const unique = pilets.reduce(
    (prev, curr) => {
      prev[curr.meta.name] = curr.meta;
      return prev;
    },
    {} as Record<string, PiletMetadata>,
  );
  return Object.keys(unique)
    .map((name) => unique[name])
    .map(getPilet);
}

export async function storePilet(file: NodeJS.ReadableStream, rootUrl: string) {
  const pilet = await getPiletDefinition(file, rootUrl);
  const { name, version } = pilet.meta;
  const exists = await getPilets().then((m) => m.some((m) => m.meta.name === name && m.meta.version === version));

  if (exists) {
    throw new Error(`A pilet with name "${name}" and version "${version}" already exists.`);
  }

  await setPilet(pilet);
  return piletData;
}
