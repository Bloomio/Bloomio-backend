'use strict';

import Twilio from 'twilio';
import logger from './logger';

const accountSID = 'AC6f003e9180a6ab8458ba89dfa272bb4e';
const authToken = '5b1cc042e22236ae9e842f1cb6e6d5f7';
const client = new Twilio(accountSID, authToken);

const sendText = (profile, message) => {
  client.messages
    .create({
      body: message,
      from: '+13608105745',
      to: '+13602504751',
    })
    .then(Twiliomessage => logger.log(logger.INFO, `${Twiliomessage.sid} and profile is ${profile}`))
    .done();
};

export default sendText;
