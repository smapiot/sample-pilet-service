import { readFromSnapshot, updateSnapshot } from './snapshot';
import type { PiletDb } from './types';
import type { ActiveAuthRequest, Pilet } from '../types';

const piletData: PiletDb = {};

export async function getPilets(): Promise<Array<Pilet>> {
  const pilets: Array<Pilet> = [];

  Object.keys(piletData).forEach((name) => {
    const pilet = piletData[name];
    const current = pilet.versions[pilet.current];
    pilets.push(current);
  });

  return pilets;
}

export async function getPilet(name: string, version: string): Promise<Pilet | undefined> {
  const versions = piletData[name]?.versions || {};
  return versions[version];
}

export async function setPilet(pilet: Pilet) {
  const { name, version } = pilet.meta;
  const current = piletData[name]?.versions || {};
  piletData[name] = {
    current: version,
    versions: {
      ...current,
      [version]: pilet,
    },
  };
  updateSnapshot(piletData);
}

const activeAuthRequests: Array<ActiveAuthRequest> = [];

export function getActiveAuthRequest(id: string) {
  return activeAuthRequests.find((r) => r.id === id);
}

export function appendAuthRequest(request: ActiveAuthRequest) {
  activeAuthRequests.push(request);

  return () => {
    const idx = activeAuthRequests.indexOf(request);
    const req = activeAuthRequests[idx];
    activeAuthRequests.splice(idx, 1);
    req.notifiers.forEach((n) => n(false));
  };
}

readFromSnapshot(piletData);
