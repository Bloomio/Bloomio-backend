'use strict';

import { Router } from 'express';
import { json, urlencoded } from 'body-parser';
import HttpError from 'http-errors';
import multer from 'multer';

import Profile from '../model/profile';
import bearerAuthMiddleware from '../lib/bearer-auth-middleware';
import logger from '../lib/logger';
import { s3Upload } from '../lib/s3';

const jsonParser = json();
const urlParser = urlencoded();
const multerUpload = multer({ dest: `${__dirname}/../temp` });
const profileRouter = new Router();

profileRouter.post('/profile', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  if (!request.account || !request.body.firstName || !request.body.location) {
    return next(new HttpError(400, 'AUTH - invalid request'));
  }
  return new Profile({
    ...request.body,
    account: request.account._id,
  })
    .save()
    .then((profile) => {
      logger.log(logger.INFO, 'Returning a 200 and a new Profile.');
      return response.json(profile);
    })
    .catch(next);
});

profileRouter.get('/profile/:id/planterbox', bearerAuthMiddleware, (request, response, next) => {
  let plantCollection = null;
  return Profile.findById(request.params.id)
    .then((profile) => {
      if (!profile) {
        return next(new HttpError(404, 'User not found, invalid id.'));
      }
      plantCollection = profile.planterBox;
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(plantCollection);
    })
    .catch(next);
});

profileRouter.get('/profile/:id', bearerAuthMiddleware, (request, response, next) => {
  return Profile.findById(request.params.id)
    .then((profile) => {
      if (!profile) {
        return next(new HttpError(404, 'Profile not found, invalid id.'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(profile);
    })
    .catch(next);
});

profileRouter.put('/profile/:id', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
  return Profile.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedProfile) => {
      if (!updatedProfile) {
        return next(new HttpError(404, 'Profile not found, invalid id.'));
      }
      logger.log(logger.INFO, 'PROFILE: PUT - responding with 200');
      return response.json(updatedProfile);
    })
    .catch(next);
});

profileRouter.put('/profile/:id/avatar', bearerAuthMiddleware, urlParser, jsonParser, multerUpload.any(), (request, response, next) => {
  const options = { runValidators: true, new: true };
  return Profile.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedProfile) => {
      if (!updatedProfile) {
        console.log('updatedProfile', updatedProfile);
        return next(new HttpError(404, 'Profile not found, invalid id.')); 
      }
      const file = request.files[0];
      console.log('file', request.files[0]);
      const key = `${file.filename}.${file.originalname}`;
      console.log(updatedProfile.avatar);

      return s3Upload(file.path, key)
        .then((url) => {
          updatedProfile.avatar = url;
          console.log(updatedProfile.avatar);
        }).save();
    })
    .then(updatedProfile => response.json(updatedProfile))
    .catch(next);
});

profileRouter.delete('/profile/:id', bearerAuthMiddleware, (request, response, next) => {
  return Profile.findByIdAndRemove(request.params.id)
    .then(() => {
      logger.log(logger.INFO, 'PROFILE: DELETE - responding with 204');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default profileRouter;
