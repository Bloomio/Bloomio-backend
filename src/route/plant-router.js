'use strict';

// import multer from 'multer';
import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpError from 'http-errors';
import logger from '../lib/logger';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import Plant from '../model/plant';


// const multerUpload = multer({ dest: `${__dirname}/../temp` });


const jsonParser = bodyParser.json();
const plantRouter = new Router();

plantRouter.post('/plants', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  logger.log(logger.INFO, 'POST - processing a request');
  if (!request.body.commonName) {
    logger.log(logger.INFO, 'PLANT-ROUTER: Responding with a 400 error code');
    return next(new HttpError(400, 'commonName is required'));
  }
  return new Plant(request.body).save()
    .then((plant) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      return response.json(plant);
    })
    .catch(next);
});

plantRouter.get('/plants/:id', bearerAuthMiddleware, (request, response, next) => {
  logger.log(logger.INFO, 'GET - processing a request');
  return Plant.findById(request.params.id)
    .then((plant) => {
      if (!plant) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!plant)');
        return next(new HttpError(404, 'plant not found'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      logger.log(logger.INFO, `GET - ${JSON.stringify(plant)}`);
      return response.json(plant);
    })
    .catch(next);
});

plantRouter.put('/plants/:id', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
  return Plant.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedPlant) => {
      if (!updatedPlant) {
        logger.log(logger.INFO, 'PUT - responding with a 404 status code');
        return next(new HttpError(404, 'Plant not found'));
      }
      logger.log(logger.INFO, 'PUT - responding with a 200 status code');
      return response.json(updatedPlant); 
    })
    .catch(next);
});

plantRouter.delete('/plants/:id', bearerAuthMiddleware, (request, response, next) => {
  return Plant.findByIdAndRemove(request.params.id)
    .then((plant) => {
      if (!plant) {
        return next(new HttpError(404, 'plant not found'));
      }
      return response.sendStatus(204);
    });
});
export default plantRouter;
