'use strict';


import { Router } from 'express';
import { json } from 'body-parser';
import HttpError from 'http-errors';
import multer from 'multer';

import Plant from '../model/plant';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import logger from '../lib/logger';
import Profile from '../model/profile';
import { s3Upload } from '../lib/s3';

const jsonParser = json();
const multerUpload = multer({ dest: `${__dirname}/../temp` });

const plantRouter = new Router();

plantRouter.post('/plants', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  if (!request.body.commonName || !request.body.placement) {
    return next(new HttpError(400, 'invalid request.'));
  }
  return Profile.findOne({ account: request.account._id })
    .then((profile) => {
      request.body.profile = profile._id;
    })
    .then(() => {
      return new Plant(request.body).save()
        .then((plant) => {
          logger.log(logger.INFO, 'POST - responding with a 200 status code.');
          return response.json(plant);
        });
    })
    .catch(next);
});

plantRouter.get('/plants/:id', bearerAuthMiddleware, (request, response, next) => {
  return Plant.findById(request.params.id)
    .then((plant) => {
      if (!plant) {
        return next(new HttpError(404, 'plant not found.'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code.');
      logger.log(logger.INFO, `GET - ${JSON.stringify(plant)}`);
      return response.json(plant);
    })
    .catch(next);
});

plantRouter.put('/plants/:id', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
  Plant.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedPlant) => {
      if (request.body.waterInterval) {
        updatedPlant.calculateNextWaterDate();
        updatedPlant.update();
      }
      return updatedPlant;
    })
    .then((updatedPlant) => {
      if (!updatedPlant) {
        return next(new HttpError(404, 'Plant not found.'));
      }
      logger.log(logger.INFO, 'PUT - responding with a 200 status code.');
      return response.json(updatedPlant);
    })
    .catch(next);
});

plantRouter.put('/plants/:id/image', bearerAuthMiddleware, jsonParser, multerUpload.any(), (request, response, next) => {
  const file = request.files[0];
  const key = `${file.filename}.${file.originalname}`;
  const options = { runValidators: true, new: true };
  return s3Upload(file.path, key)
    .then((url) => {
      return Plant.findByIdAndUpdate(request.params.id, { image: url }, options)
        .then((updatedPlant) => {
          if (!updatedPlant) {
            return next(new HttpError(404, 'Plant not found, invalid id.'));
          }
          return response.json(updatedPlant);
        })
        .catch(next);
    })
    .catch(next);
});

plantRouter.delete('/plants/:id', bearerAuthMiddleware, (request, response, next) => {
  return Plant.findById(request.params.id)
    .then((plant) => {
      if (!plant) {
        return next(new HttpError(404, 'plant not found.'));
      }
      plant.remove();
      return response.sendStatus(204);
    });
});

export default plantRouter;
