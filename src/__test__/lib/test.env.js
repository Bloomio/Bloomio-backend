process.env.NODE_ENV = 'development';
process.env.PORT = 5000;
process.env.MONGODB_URI = 'mongodb://localhost/testing5';
process.env.BLOOMIO_SECRET = 'top secret';

const isAwsMock = true;

if (isAwsMock) {
  process.env.AWS_BUCKET = 'fake';
  process.env.AWS_SECRET_ACCESS_KEY = 'fakeasdfasdfsafdsafsadfasfasdfsadfsadfsadfdsafas';
  process.env.AWS_ACCESS_KEY_ID = 'fakekeyinsidetestenv';
  require('./setup');
} else {
  require('dotenv').config();
}

const isRealTwilio = true;

if (isRealTwilio) {
  require('dotenv').config();
}
