'use strict';


import { Router } from 'express';
import { json } from 'body-parser';
import HttpError from 'http-errors';

import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import logger from '../lib/logger';
import Profile from '../model/profile';
import PlantResource from '../model/plant-resource';

const jsonParser = json();
const plantResourceRouter = new Router();

plantResourceRouter.post('/bloomiogarden', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  if (!request.account.isAdmin) {
    return next(new HttpError(401, 'Unauthorized POST request.'));
  }
  if (!request.body.commonName || !request.body.scientificName || !request.body.groupType
     || !request.body.waterDate || !request.body.fertilizerDate || !request.body.mistingDate) {
    return next(new HttpError(400, 'Invalid request, ALL properties required.'));
  }
  return Profile.findOne({ account: request.account._id })
    .then((profile) => {
      request.body.profile = profile._id;
    })
    .then(() => {
      return new PlantResource(request.body).save()
        .then((plantRes) => {
          logger.log(logger.INFO, 'POST - responding with a 200 status code.');
          return response.json(plantRes);
        });
    })
    .catch(next);
});

plantResourceRouter.get('/bloomiogarden/:id', (request, response, next) => {
  return PlantResource.findById(request.params.id)
    .then((plantTemplate) => {
      if (!plantTemplate) {
        return next(new HttpError(404, 'plant not found.'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code.');
      logger.log(logger.INFO, `GET - ${JSON.stringify(plantTemplate)}`);
      return response.json(plantTemplate);
    })
    .catch(next);
});

plantResourceRouter.put('/bloomiogarden/:id', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
  if (!request.account.isAdmin) {
    return next(new HttpError(401, 'Unauthorized POST request.'));
  }
  return Profile.findOne({ account: request.account._id })
    .then((profile) => {
      request.body.profile = profile._id;
    })
    .then(() => {
      return PlantResource.findByIdAndUpdate(request.params.id, request.body, options)
        .then((updatedPlantResource) => {
          if (!updatedPlantResource) {
            return next(new HttpError(404, 'Plant Resource not found.'));
          }
          logger.log(logger.INFO, 'PUT - responding with a 200 status code.');
          return response.json(updatedPlantResource);
        });
    })
    .catch(next);
});

plantResourceRouter.delete('/bloomiogarden/:id', bearerAuthMiddleware, (request, response, next) => {
  if (!request.account.isAdmin) {
    return next(new HttpError(401, 'Unauthorized POST request.'));
  }
  return PlantResource.findByIdAndRemove(request.params.id)
    .then((plantTemplate) => {
      if (!plantTemplate) {
        return next(new HttpError(404, 'plant not found.'));
      }
      return response.sendStatus(204);
    });
});

export default plantResourceRouter;
