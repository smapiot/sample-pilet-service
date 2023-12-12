import { RequestHandler } from 'express';
import { getActiveAuthRequest } from '../db';

const authHeaderExtract = /^basic\s+([a-fA-F0-9]+)$/i;

function checkKey(authHeader: string, keys: Array<string>, scopes: Array<string>) {
  const result = authHeaderExtract.exec(authHeader);
  return result && keys.includes(result[1]);
}

export const checkAuth =
  (keys: Array<string>, authUrl: string, ...scopes: Array<string>): RequestHandler =>
  async (req, res, next) => {
    const authorized = await checkKey(req.headers.authorization, keys, scopes);

    if (!authorized) {
      res.status(401).json({
        success: false,
        interactiveAuth: authUrl,
        message: 'Invalid API key supplied.',
      });
    } else {
      next();
    }
  };

export const checkAuthRequestId = (): RequestHandler => async (req, res, next) => {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({
      message: 'Missing required query parameter "id".',
    });
  }

  const activeRequest = getActiveAuthRequest(id);

  if (!activeRequest) {
    return res.status(404).json({
      message: 'The provided authorization request does not exist.',
    });
  }

  next();
};
