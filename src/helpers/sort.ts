import { PiletMetadata } from '../types';

function comparePilets(a: PiletMetadata, b: PiletMetadata) {
  return a.name.localeCompare(b.name);
}

export function sortPilets(pilets: Array<PiletMetadata>) {
  const sortedPilets = [...pilets];
  sortedPilets.sort(comparePilets);
  return sortedPilets;
}
