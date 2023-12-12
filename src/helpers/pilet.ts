import { dirname, basename } from 'path';
import { formatAuthor } from './author';
import { untar } from './untar';
import { computeHash, computeIntegrity } from './hash';
import { PiletMetadata, PackageData, PackageFiles, Pilet } from '../types';

const packageRoot = 'package/';
const checkV1 = /^\/\/\s*@pilet\s+v:1\s*\(([A-Za-z0-9\_\:\-]+)\)/;
const checkV2 = /^\/\/\s*@pilet\s+v:2\s*\(([A-Za-z0-9\_\:\-]+)\s*,\s*(.*)\)/;
const checkVx = /^\/\/\s*@pilet\s+v:x\s*(?:\((.*)\))?/;
let iter = 1;

function getPackageJson(files: PackageFiles): PackageData {
  const fileName = `${packageRoot}package.json`;
  const fileContent = files[fileName];
  const content = fileContent.toString('utf8');
  return JSON.parse(content);
}

function getContent(path: string, files: PackageFiles) {
  const content = path && files[path];
  return content && content.toString('utf8');
}

function getPiletMainPath(data: PackageData, files: PackageFiles) {
  const paths = [
    data.main,
    `dist/${data.main}`,
    `${data.main}/index.js`,
    `dist/${data.main}/index.js`,
    'index.js',
    'dist/index.js',
  ];
  return paths.map((filePath) => `${packageRoot}${filePath}`).filter((filePath) => !!files[filePath])[0];
}

function getDependencies(deps: string, rootUrl: string, name: string, version: string) {
  try {
    const depMap = JSON.parse(deps);

    if (depMap && typeof depMap === 'object') {
      if (Object.keys(depMap).every((m) => typeof depMap[m] === 'string')) {
        const updateDepMapUrls = <K extends keyof typeof depMap>(
          obj: typeof depMap,
          key: K,
          upDatedValue: (typeof depMap)[K],
        ): void => {
          obj[key] = upDatedValue;
        };

        Object.keys(depMap).forEach((k) => updateDepMapUrls(depMap, k, evalDep(depMap[k], rootUrl, name, version)));

        return depMap;
      }
    }
  } catch {}

  return {};
}

function evalDep(dependency: string, rootUrl: string, name: string, version: string): any {
  if (dependency.includes(rootUrl)) {
    return dependency;
  }
  return `${rootUrl}/files/${name}/${version}/${dependency}`;
}

export function extractPiletMetadata(
  data: PackageData,
  main: string,
  file: string,
  files: PackageFiles,
  rootUrl: string,
): PiletMetadata {
  const name = data.name;
  const version = data.preview ? `${data.version}-pre.${iter++}` : data.version;
  const author = formatAuthor(data.author);
  const license = {
    type: data.license || 'ISC',
    text: getContent(`${packageRoot}LICENSE`, files) || '',
  };

  if (checkV1.test(main)) {
    // uses single argument; requireRef (required)
    const [, requireRef] = checkV1.exec(main);
    return {
      name,
      version,
      type: 'v1',
      requireRef,
      description: data.description,
      custom: data.custom,
      author,
      integrity: computeIntegrity(main),
      link: `${rootUrl}/files/${name}/${version}/${file}`,
      license,
    };
  } else if (checkV2.test(main)) {
    // uses two arguments; requireRef and dependencies as JSON (required)
    const [, requireRef, plainDependencies] = checkV2.exec(main);
    return {
      name,
      version,
      type: 'v2',
      requireRef,
      description: data.description || '',
      integrity: computeIntegrity(main),
      author: formatAuthor(data.author),
      custom: data.custom,
      dependencies: getDependencies(plainDependencies, rootUrl, name, version),
      link: `${rootUrl}/files/${name}/${version}/${file}`,
      license,
    };
  } else if (checkVx.test(main)) {
    // uses single argument; spec identifier (optional)
    const [, spec] = checkVx.exec(main);
    return {
      name,
      version,
      type: `vx`,
      spec,
      description: data.description || '',
      integrity: computeIntegrity(main),
      author: formatAuthor(data.author),
      custom: data.custom,
      link: `${rootUrl}/files/${name}/${version}/${file}`,
      license,
    };
  } else {
    return {
      name,
      version,
      type: 'v0',
      description: data.description,
      custom: data.custom,
      author,
      hash: computeHash(main),
      link: `${rootUrl}/files/${name}/${version}/${file}`,
      license,
    };
  }
}

export function getPiletDefinition(stream: NodeJS.ReadableStream, rootUrl: string): Promise<Pilet> {
  return untar(stream).then((files) => {
    const data = getPackageJson(files);
    const path = getPiletMainPath(data, files);
    const root = dirname(path);
    const file = basename(path);
    const main = getContent(path, files);
    const meta = extractPiletMetadata(data, main, file, files, rootUrl);
    return {
      meta,
      files: Object.fromEntries(
        Object.entries(files)
          .filter(([name]) => name.startsWith(`${root}/`))
          .map(([name, buffer]) => [name.substring(root.length + 1), buffer]),
      ),
    };
  });
}
