import express from'express';

const AliveRouter = express.Router();

AliveRouter.get('alive', (req, res) => {
  res.json({status: 'alive'});
});

export { AliveRouter };
