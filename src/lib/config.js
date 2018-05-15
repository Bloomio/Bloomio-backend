'use strict';

const config = {};

config.port = process.env.PORT;

config.ownNumber = process.env.TELEPHONE_NUMBER;

config.twilioConfig = {
  accountSID: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  number: process.env.TWILIO_NUMBER,
  redirectURL: 'http://localhost:3000/auth',
};

config.mongoConfig = {
  ip: '127.0.0.1',
  port: 27017,
  name: 'bloomio-calendar',
};

export default config;
