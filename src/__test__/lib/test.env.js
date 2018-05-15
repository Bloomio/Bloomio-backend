process.env.NODE_ENV = 'development';
process.env.PORT = 5000;
process.env.MONGODB_URI = 'mongodb://localhost/testing5';
process.env.BLOOMIO_SECRET = 'top secret';

// set this to true or false depending on if you want to hit the mock AWS-SDK 
// set to false if you want to make a real API call to your bucket

const isAwsMock = true;

if (isAwsMock) {
  process.env.AWS_BUCKET = 'fake';
  process.env.AWS_SECRET_ACCESS_KEY = 'fakeasdfasdfsafdsafsadfasfasdfsadfsadfsadfdsafas';
  process.env.AWS_ACCESS_KEY_ID = 'fakekeyinsidetestenv';
  require('./setup');
} else {
  // remember to set your .env vars and add .env in .gitignore
  require('dotenv').config();
}
