import { describe, it, expect } from 'vitest';
import { extractPiletMetadata } from './pilet';

const pkg = {
  name: 'test',
  description: 'abc',
  version: '0.1.0',
  author: {
    name: 'User Example',
    email: 'user@example.com',
  },
  main: 'prod.js',
  peerDependencies: {
    external: '0.1.0',
  },
};

describe('Extract Metadata', () => {
  it('returns metadata based on a package.json', () => {
    const metaData = extractPiletMetadata(pkg, '', '', {}, '');
    expect(metaData).toMatchObject({
      name: 'test',
      version: '0.1.0',
      author: {
        name: 'User Example',
        email: 'user@example.com',
      },
    });
  });

  it('returns requireRef if given', () => {
    const metaData = extractPiletMetadata(pkg, '//@pilet v:1(foo)', '', {}, '');
    expect(metaData).toMatchObject({
      name: 'test',
      version: '0.1.0',
      requireRef: 'foo',
      author: {
        name: 'User Example',
        email: 'user@example.com',
      },
    });
  });

  it('skips requireRef for old format', () => {
    const metaData = extractPiletMetadata(pkg, '//@pilet v:0', '', {}, '');
    expect(metaData).toMatchObject({
      name: 'test',
      version: '0.1.0',
      author: {
        name: 'User Example',
        email: 'user@example.com',
      },
    });
  });
});

describe('Format Author', () => {
  it('returns metadata with a formated author', () => {
    const metaData = extractPiletMetadata(
      {
        name: pkg.name,
        description: '',
        author: 'User Example',
        version: '',
      },
      '',
      '',
      {},
      '',
    );
    expect(metaData.author).toMatchObject({
      name: 'User Example',
    });
  });
});
