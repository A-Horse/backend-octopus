import * as express from 'express';

import { configure } from '../config/configure';
import { AuthedData, authService } from '../service/auth.service';

const AuthRouter = express.Router();

AuthRouter.post('/logout', (req, res) => {
  res.status(204).send();
});

AuthRouter.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const creds = {
    email: email.toLowerCase().trim(),
    password: password.trim()
  };
  try {
    const authedData: AuthedData = await authService.login(creds.email, creds.password);
    return res.status(200).json(authedData);
  } catch (error) {
    res.status(401).send();
  }
});

AuthRouter.post('/signup', async (req, res, next) => {
  const { username, password, email } = req.body;
  if (configure.get('DISABLE_SIGNUP')) {
    return res.status(403).send();
  }

  await authService.signup({
    username,
    password,
    email
  });
});

export { AuthRouter };
