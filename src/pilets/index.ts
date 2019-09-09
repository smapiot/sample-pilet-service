import { getPilets, setPilet } from '../db';
import { getPiletDefinition } from '../helpers';
import { PiletMetadata } from '../types';

export async function latestPilets() {
  const pilets = await getPilets();
  const unique = pilets.reduce(
    (prev, curr) => {
      prev[curr.meta.name] = curr.meta;
      return prev;
    },
    {} as Record<string, PiletMetadata>,
  );
  return Object.keys(unique).map(name => unique[name]);
}

export async function storePilet(file: NodeJS.ReadableStream, rootUrl: string) {
  const meta = await getPiletDefinition(file, rootUrl);
  await setPilet(meta);
}
