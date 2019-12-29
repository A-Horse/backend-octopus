import * as express from 'express';

import { configure } from '../config/configure';
import { AuthedData, authServive } from '../service/auth.service';

const UserRouter = express.Router();

UserRouter.post('/logout', (req, res) => {
  res.status(204).send();
});

UserRouter.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const creds = {
    email: email.toLowerCase().trim(),
    password: password.trim()
  };
  try {
    const authedData: AuthedData = await authServive.login(creds.email, creds.password);
    return res.status(200).json(authedData);
  } catch (error) {
    res.status(401).send();
  }
});

UserRouter.post('/signup', async (req, res, next) => {
  const { username, password, email } = req.body;
  if (configure.get('DISABLE_SIGNUP')) {
    return res.status(403).send();
  }

  await authServive.signup({
    username,
    password,
    email
  });
});

export { UserRouter };
