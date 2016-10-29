import express from'express';

const RootRouter = express.Router();

RootRouter.get('/hello', (req, res) => {
  return res.send('hello world!')
});

export {RootRouter};
