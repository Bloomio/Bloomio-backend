'use strict';

process.env.NODE_ENV = 'development';
process.env.PORT = 5000;
process.env.MONGODB_URI = 'mongodb://localhost/testing5';
process.env.BLOOMIO_SECRET = 'top secret';
process.env.TELEPHONE_NUMBER = '+13602504751';
process.env.TWILIO_NUMBER = '+13608105745';
process.env.TWILIO_ACCOUNT_SID = 'AC6f003e9180a6ab8458ba89dfa272bb4e';
process.env.TWILIO_AUTH_TOKEN = '5b1cc042e22236ae9e842f1cb6e6d5f7';

var isAwsMock = true;

if (isAwsMock) {
  process.env.AWS_BUCKET = 'fake';
  process.env.AWS_SECRET_ACCESS_KEY = 'fakeasdfasdfsafdsafsadfasfasdfsadfsadfsadfdsafas';
  process.env.AWS_ACCESS_KEY_ID = 'fakekeyinsidetestenv';
  require('./setup');
} else {
  require('dotenv').config();
}