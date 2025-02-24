export const defaultProtocol = process.env.HTTPS ? 'https' : 'http';
export const defaultPort = +(process.env.PORT || 9000);
export const defaultSnapshotDir = process.env.PILETS_SNAPSHOT ?? 'pilets';
export const defaultPiletPath = `/api/v1/pilet`;
export const defaultAuthPath = `/api/v1/auth`;
export const defaultLoginPath = `/login`;
export const defaultFilePath = '/files/*';
