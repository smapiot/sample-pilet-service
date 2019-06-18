function getUrl() {
  const defaultProtocol = process.env.HTTPS ? 'https' : 'http';
  const protocol = process.env.HTTP_X_FORWARDED_PROTO || defaultProtocol;
  const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;
  return `${protocol}://${host}`;
}

export const port = process.env.PORT || 9000;
export const rootUrl = getUrl();
export const basePath = '/api/v1';
export const piletPath = `${basePath}/pilet`;
export const filePath = '/files(/@:org)?/:name/:version/:file?';
