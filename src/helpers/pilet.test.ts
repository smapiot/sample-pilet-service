import { extractPiletMetadata } from './pilet';

const pkg = {
  name: 'test',
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
    const metaData = extractPiletMetadata(pkg, '');
    expect(metaData).toMatchObject({
      name: 'test',
      version: '0.1.0',
      author: {
        name: 'User Example',
        email: 'user@example.com',
      },
      dependencies: pkg.peerDependencies,
      content: '',
    });
  });
});

describe('Format Author', () => {
  it('returns metadata with a formated author', () => {
    const metaData = extractPiletMetadata(
      {
        name: pkg.name,
        author: 'User Example',
        version: '',
      },
      '',
    );
    expect(metaData.author).toMatchObject({
      name: 'User Example',
    });
  });
});
