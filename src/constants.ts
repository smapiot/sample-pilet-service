export const defaultProtocol = process.env.HTTPS ? 'https' : 'http';
export const defaultPort = +(process.env.PORT || 9000);
export const defaultPiletPath = `/api/v1/pilet`;
export const defaultFilePath = '/files(/@:org)?/:name/:version/((*/)?:file)?';
