export interface PiletDependencies {
  [key: string]: string;
}

export interface PiletMetadata {
  name: string;
  version: string;
  author: {
    name: string;
    email: string;
  };
  license: {
    type: string;
    text: string;
  };
  dependencies?: PiletDependencies;
  link: string;
  hash: string;
}

export interface Pilet {
  meta: PiletMetadata;
  root: string;
  files: PackageFiles;
}

export interface PackageFiles {
  [file: string]: Buffer;
}

export interface PackageData {
  name: string;
  version: string;
  preview?: boolean;
  author:
    | string
    | {
        name?: string;
        url?: string;
        email?: string;
      };
  main?: string;
  license?: string;
  dependencies?: {
    [name: string]: string;
  };
  devDependencies?: {
    [name: string]: string;
  };
  peerDependencies?: {
    [name: string]: string;
  };
}
