import { RequestHandler } from 'express';

const authHeaderExtract = /^basic\s+([a-fA-F0-9]+)$/i;

function checkKey(authHeader: string, keys: Array<string>, scopes: Array<string>) {
  const result = authHeaderExtract.exec(authHeader);
  return result && keys.includes(result[1]);
}

export const checkAuth = (keys: Array<string>, ...scopes: Array<string>): RequestHandler => async (req, res, next) => {
  const authorized = await checkKey(req.headers.authorization, keys, scopes);

  if (!authorized) {
    res.status(401).json({
      success: false,
      message: 'Invalid API key supplied.',
    });
  } else {
    next();
  }
};
