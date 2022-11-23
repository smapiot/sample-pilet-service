import { ActiveAuthRequest, Pilet } from '../types';

const piletData: Record<string, Record<string, Pilet>> = {};

export async function getPilets(): Promise<Array<Pilet>> {
  const pilets: Array<Pilet> = [];

  Object.keys(piletData).forEach(name =>
    Object.keys(piletData[name]).forEach(version => {
      const pilet = piletData[name][version];
      pilets.push(pilet);
    }),
  );

  return pilets;
}

export async function getPilet(name: string, version: string): Promise<Pilet | undefined> {
  const versions = piletData[name] || {};
  return versions[version];
}

export async function setPilet(pilet: Pilet) {
  const meta = pilet.meta;
  const current = piletData[meta.name] || {};
  piletData[meta.name] = {
    ...current,
    [meta.version]: pilet,
  };
}

const activeAuthRequests: Array<ActiveAuthRequest> = [];

export function getActiveAuthRequest(id: string) {
  return activeAuthRequests.find(r => r.id === id);
}

export function appendAuthRequest(request: ActiveAuthRequest) {
  activeAuthRequests.push(request);

  return () => {
    const idx = activeAuthRequests.indexOf(request);
    const req = activeAuthRequests[idx];
    activeAuthRequests.splice(idx, 1);
    req.notifiers.forEach(n => n(false));
  };
}
