export interface PiletMetadataV0 {
  /**
   * The content of the pilet. If the content is not available
   * the link will be used (unless caching has been activated).
   */
  content?: string;
  /**
   * The link for retrieving the content of the pilet.
   */
  link?: string;
  /**
   * The computed hash value of the pilet's content. Should be
   * accurate to allow caching.
   */
  hash: string;
  /**
   * If available indicates that the pilet should not be cached.
   * In case of a string this is interpreted as the expiration time
   * of the cache. In case of an accurate hash this should not be
   * required or set.
   */
  noCache?: boolean | string;
  /**
   * The schema type of the pilet.
   */
  type: 'v0';
}

export interface PiletMetadataV1 {
  /**
   * The link for retrieving the content of the pilet.
   */
  link: string;
  /**
   * The reference name for the global require.
   */
  requireRef: string;
  /**
   * The computed integrity of the pilet. Will be used to set the
   * integrity value of the script.
   */
  integrity?: string;
  /**
   * The schema type of the pilet.
   */
  type: 'v1';
}

export interface PiletMetadataV2 {
  /**
   * The link for retrieving the content of the pilet.
   */
  link: string;
  /**
   * The reference name for the global require.
   */
  requireRef: string;
  /**
   * The computed integrity of the pilet. Will be used to set the
   * integrity value of the script.
   */
  integrity?: string;
  /**
   * The schema type of the pilet.
   */
  type: 'v2';
  /**
   * The dependencies that should be loaded for this pilet.
   */
  dependencies?: Record<string, string>;
}

export interface PiletMetadataVx {
  /**
   * The link for retrieving the content of the pilet.
   */
  link: string;
  /**
   * The reference name for the used spec, if any.
   */
  spec?: string;
  /**
   * The computed integrity of the pilet. Will be used to set the
   * integrity value of the script.
   */
  integrity?: string;
  /**
   * The schema type of the pilet.
   */
  type: 'vx';
}

export interface PiletMetadataBase {
  /**
   * The name of the pilet, i.e., the package id.
   */
  name: string;
  /**
   * The version of the pilet. Should be semantically versioned.
   */
  version: string;
  /**
   * Optionally provides some custom metadata for the pilet.
   */
  custom?: any;
  /**
   * The description of the pilet.
   */
  description: string;
  /**
   * The author of the pilet.
   */
  author: {
    name: string;
    email: string;
  };
  /**
   * The license of the pilet.
   */
  license: {
    type: string;
    text: string;
  };
}

/**
 * Describes the metadata transported by a pilet.
 */
export type PiletMetadata = (PiletMetadataV0 | PiletMetadataV1 | PiletMetadataV2 | PiletMetadataVx) & PiletMetadataBase;

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
