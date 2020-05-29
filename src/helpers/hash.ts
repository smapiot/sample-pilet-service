import { createHash } from 'crypto';

export function computeHash(content: string) {
  const sha1sum = createHash('sha1');
  sha1sum.update(content || '');
  return sha1sum.digest('hex');
}

export function computeIntegrity(content: string) {
  const sum = createHash('sha256');
  sum.update(content || '');
  return `sha256-${sum.digest('base64')}`;
}
