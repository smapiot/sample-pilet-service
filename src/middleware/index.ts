import { RequestHandler } from 'express';
import { checkKey } from '../auth';

export function checkAuth(...scopes: Array<string>): RequestHandler {
  return async (req, res, next) => {
    const authorized = await checkKey(req.headers.authorization, scopes);

    if (!authorized) {
      res.status(401).json({
        success: false,
        message: 'Invalid API key supplied.',
      });
    } else {
      next();
    }
  };
}
