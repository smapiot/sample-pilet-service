import { getPilets, setPilet } from '../db';
import { getPiletDefinition } from '../helpers';
import { PiletMetadata, PiletDependencies } from '../types';

export function convertDependencies(dependencies: PiletDependencies) {
  var depNames = Object.keys(dependencies);
  return depNames.map(name => ({
    name,
    link: dependencies[name],
  }));
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
  return Object.keys(unique).map(name => unique[name]);
}

export async function storePilet(file: NodeJS.ReadableStream) {
  const meta = await getPiletDefinition(file);
  await setPilet(meta);
}
