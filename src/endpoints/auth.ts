import { RequestHandler } from 'express';
import { appendAuthRequest, getActiveAuthRequest } from '../db';

function renderPage(content: string) {
  return `<!doctype html>
  <meta charset=utf8>
  <title>Authorize Login</title>
  <style>
    html, body, form, div {
      margin: 0;
      padding: 0;
      height: 100%;
      width: 100%;
    }

    form, div {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    button, p {
      font-family: gill sans, sans-serif;
      font-size: 1.5rem;
    }

    button {
      padding: 0.5rem 2rem;
      background: #080;
      color: white;
      border: 0;
      border-radius: 7px;
      cursor: pointer;
    }

    button:hover {
      background: #0b0;
    }
  </style>
  ${content}`;
}

export const getLoginPage = (): RequestHandler => async (_, res) =>
  res.send(
    renderPage(`
    <form method=POST>
      <button>Authorize</button>
    </form>
  `),
  );

export const finishLogin = (): RequestHandler => async (req, res) => {
  const { id } = req.query;
  const activeRequest = getActiveAuthRequest(id as string);
  activeRequest.status = 'done';
  activeRequest.notifiers.forEach((n) => n(true));
  activeRequest.notifiers.splice(0, activeRequest.notifiers.length);
  return res.send(
    renderPage(`
    <div>
      <p>
        Authorized. You can close this page now.
      </p>
    </div>
  `),
  );
};

export const getAuthStatus =
  (apiKeys: Array<string>): RequestHandler =>
  async (req, res) => {
    const { id } = req.query;
    const activeRequest = getActiveAuthRequest(id as string);

    if (activeRequest.status === 'done') {
      return res.json({
        token: apiKeys[0],
        mode: 'basic',
      });
    }

    return await new Promise((resolve) => {
      activeRequest.notifiers.push((success) => {
        if (success) {
          res.status(200).json({
            token: apiKeys[0],
            mode: 'basic',
          });
        } else {
          res.status(400).json({
            message: 'The request expired.',
          });
        }

        resolve();
      });
    });
  };

export const createAuthRequest =
  (authUrl: string, loginUrl: string): RequestHandler =>
  async (req, res) => {
    const { clientId, clientName, description } = req.body;
    const current = new Date();
    const diff = 30 * 60000;
    const expires = new Date(current.getTime() + diff);
    const id = Math.random().toString(26).substring(2);

    const handle = setTimeout(() => {
      remove();
      clearTimeout(handle);
    }, diff);

    const remove = appendAuthRequest({
      id,
      clientId,
      clientName,
      description,
      status: 'new',
      notifiers: [],
    });

    return res.json({
      loginUrl: `${loginUrl}?id=${id}`,
      callbackUrl: `${authUrl}?id=${id}`,
      expires,
    });
  };
