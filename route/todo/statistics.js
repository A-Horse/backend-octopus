import express from 'express';
import {authJwt} from '../middle/jwt';
import {TodoModel} from '../../model/todo';
import {AccessLimitError, NotFoundError} from '../../service/error';
import {validateRequest} from '../../service/validate';
import R from 'fw-ramda';

const TodoStatisticsRouter = express.Router();

TodoStatisticsRouter.use(authJwt);



export {TodoStatisticsRouter};

