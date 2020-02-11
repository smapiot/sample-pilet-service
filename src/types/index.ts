export interface PiletMetadata {
  name: string;
  description: string;
  custom?: any;
  requireRef?: string;
  version: string;
  author: {
    name: string;
    email: string;
  };
  license: {
    type: string;
    text: string;
  };
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
  description: string;
  version: string;
  preview?: boolean;
  custom?: any;
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
