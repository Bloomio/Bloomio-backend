'use strict';

import Twilio from 'twilio';
import logger from './logger';

const accountSID = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new Twilio(accountSID, authToken);

const sendText = (profile, message) => {
  client.messages
    .create({
      body: message,
      from: process.env.TWILIO_NUMBER,
      to: process.env.TELEPHONE_NUMBER,
    })
    .then(Twiliomessage => logger.log(logger.INFO, `${Twiliomessage.sid} and profile is ${profile}`))
    .done();
};

export default sendText;
