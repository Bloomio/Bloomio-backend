'use strict';

import express from 'express';
import mongoose from 'mongoose';
// import google from 'googleapis';
// import date from 'datejs';
// import twilio from 'twilio';
import logger from './logger';
import errorMiddleware from './error-middleware';
import accountRouter from '../route/account-router';
import profileRouter from '../route/profile-router';
import plantRouter from '../route/plant-router';

const app = express();
let server = null;

// routes will be app.use'd here
app.use(accountRouter);
app.use(profileRouter);
app.use(plantRouter);

app.all('*', (request, response) => {
  logger.log(logger.INFO, 'Returning a 404 from the catch-all/default route');
  return response.sendStatus(404);
});

app.use(errorMiddleware);

const startServer = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      server = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO, `Server is listening on port ${process.env.PORT}`);
      });
    });
};

const stopServer = () => {
  return mongoose.disconnect()
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'Server is off');
      });
    });
};

export { startServer, stopServer };
