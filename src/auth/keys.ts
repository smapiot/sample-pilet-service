// generated with:
// crypto.createHash('sha256').update(Math.random().toString()).digest().toString('hex')
const standardKeys = [
  'df133a512569cbc85f69788d1b7ff5a909f6bcfe1c9a2794283a2fc35175882c',
  'da91e6a8aeee998b7d6b0701486e4909d2ee14fbcc0af5de601c1d09982141d5',
  'f94fa7067e0299679af2b1dda6f1835cd7ed03a43c104446954b11ec7b1509d0',
  'edf8c9275873ca743394b3367e67149d6fda5306b577113fbf1ff4f191de69e4',
  'ad647bdc23b7437b8fa8f27c3e2d3f70fbb493c53e9160e07d37a98df333b188',
];

function getKeys(envKeys: string) {
  if (envKeys) {
    return envKeys.split(',');
  }

  return standardKeys;
}

export const defaultKeys = getKeys(process.env.PILET_API_KEYS);
