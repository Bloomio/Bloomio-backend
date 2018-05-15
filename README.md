**Author**: Daniel Shelton, Joanna Coll, Jennifer Piper, David Stoll

**Version**: 1.0.0

![](./src/assets/bloomio-logo.jpg)
# Overview
**Bloomio** is a calendar-assistant app designed to assist in caring for one's plants and also utilizes an extensive database of comprehensive plant-care directions. Users are able to specify their personal collections of plants they own and **Bloomio** will take care of notifying the user which plants are due for watering. 

# Getting Started
## Initialize Project
```
npm init -y
```
## Developer Dependencies
```
npm i -D aws-sdk-mock babel-cli babel-eslint babel-preset-env babel-preset-stage-0 babel-register eslint eslint-config-airbnb-base eslint-plugin-import eslint-plugin-jest jest superagent winston@next
```
## Dependencies
```
npm i aws-sdk bcrypt body-parser crypto dotenv express faker fs-extra http-errors jsonwebtoken mongoose multer twilio
```

# API routes
  1. Account
    - POST /signup
  2. Profile
    - POST /profile
    - GET /profile/:id
  3. Plant
    - POST /plant
    - GET /plant/:id
    - PUT /plant/id

# Version Release Schedule

## v 1.0.0
- 05-13-2018 2:53PM - Initial project scaffolding.
- 05-14-2018 10:30AM - Logger middleware added.
- 05-14-2018 10:40AM - Basic-auth middleware added.
- 05-14-2018 10:45AM - Bearer-auth middleware added.
- 05-14-2018 10:50AM - Error middleware added.
- 05-14-2018 10:55AM - S3 middleware added.
- 05-14-2018 11:00AM - Server and remaining dependencies added.
- 05-14-2018 11:40AM - Scaffolding finalized.

## v 1.1.0
- 05-14-2018 1:04PM - Account Schema added.
- 05-14-2018 2:05PM - Profile Schema added.
- 05-14-2018 5:06PM - Profile GET route added.
- 05-14-2018 8:32PM - Documentation reformatted.

 
