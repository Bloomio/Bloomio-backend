'use strict';

import bodyParser from 'body-parser';
import HttpError from 'http-errors';
import { Router } from 'express';

import Account from '../model/account';
import basicAuthMiddleware from '../lib/basic-auth-middleware';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();
const accountRouter = new Router();

accountRouter.post('/signup', jsonParser, (request, response, next) => {
  if (!request.body.username || !request.body.email || !request.body.password) {
    logger.log(logger.INFO, 'Invalid request');
    throw new HttpError(400, 'Invalid request.');
  }
  return Account.create(request.body.username, request.body.email, request.body.password)
    .then((account) => {
      delete request.body.password;
      logger.log('logger.INFO', 'AUTH - creating TOKEN.');
      return account.createToken();
    })
    .then((token) => {
      logger.log('logger.INFO', 'AUTH - returning a 200 code and a token.');
      return response.json({ token });
    })
    .catch(next);
});

accountRouter.get('/login', basicAuthMiddleware, (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(400, 'AUTH - invalid request.'));
  }
  return request.account.createToken()
    .then((token) => {
      logger.log(logger.INFO, 'LOGIN - responding with a 200 status and a token.');
      return response.json({ token });
    })
    .catch(next);
});

accountRouter.put('/accounts/:id', basicAuthMiddleware, jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
  return Account.findByIdAndUpdate(request.params.id, request.body, options)
    .then((accountToUpdate) => {
      logger.log(logger.INFO, 'PUT - responding with a 200 status code.');
      return response.json(accountToUpdate);
    })
    .catch(next);
});

accountRouter.delete('/accounts/:id', basicAuthMiddleware, (request, response, next) => {
  return Account.findByIdAndRemove(request.params.id)
    .then(() => {
      logger.log(logger.INFO, 'DELETE - Account successfully deleted.');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default accountRouter;
