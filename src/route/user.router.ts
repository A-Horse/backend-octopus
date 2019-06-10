import * as express from 'express';
import * as R from 'ramda';
import { AccessLimitError } from '../service/error';
import { authJwt } from '../route/middle/jwt';
import { validate } from '../route/middle/check';
import { JWT_KEY } from '../constant';
import { configure } from '../configure';
import { authServive, AuthedData } from '../service/auth.service';

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
  if (configure.getConfig().DISABLE_SIGNUP) {
    return res.status(403).send();
  }

  await authServive.signup({
    username,
    password,
    email
  });
});


export { UserRouter };
