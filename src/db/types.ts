import { Pilet } from '../types';

export interface PiletVersions {
  current: string;
  versions: Record<string, Pilet>;
}

export type PiletDb = Record<string, PiletVersions>;
