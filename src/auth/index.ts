import { keys } from './keys';

const authHeaderExtract = /^basic\s+([a-fA-F0-9]+)$/i;

export function checkKey(authHeader: string, scopes: Array<string>) {
  const result = authHeaderExtract.exec(authHeader);
  return result && keys.includes(result[1]);
}
