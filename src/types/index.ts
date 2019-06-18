export interface PiletMetadata {
  name: string;
  version: string;
  author: {
    name: string;
    email: string;
  };
  dependencies?: {
    [key: string]: string;
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
