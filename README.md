![bloomio-logo](./src/assets/bloomio-logo.png)

**```Author```**```: Daniel Shelton, Joanna Coll, Jennifer Piper, David Stoll```


## Overview
[![Build Status](https://travis-ci.org/Bloomio/Bloomio-backend.svg?branch=staging)](https://travis-ci.org/Bloomio/Bloomio-backend)
[![Build Status](https://travis-ci.org/Bloomio/Bloomio-backend.svg?branch=master)](https://travis-ci.org/Bloomio/Bloomio-backend)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/Bloomio/Bloomio-backend/network)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/Bloomio/Bloomio-backend)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/Bloomio/Bloomio-backend)
[![jest](https://facebook.github.io/jest/img/jest-badge.svg)](https://github.com/Bloomio/Bloomio-backend)

**```Version```**```: 1.0.0```

**Bloomio** is a calendar-assistant app designed to assist in caring for one's plants and also utilizes an extensive database of comprehensive plant-care directions. Users are able to specify their personal collections of plants they own and **Bloomio** will take care of notifying the user which plants are due for watering. 

# Getting Started

## Initialize Project
```
npm init -y
```
## Developer Dependencies
[![ForTheBadge uses-js](https://ForTheBadge.com/images/badges/uses-js.svg)](https://ForTheBadge.com)

```
npm i -D aws-sdk-mock babel-cli babel-eslint babel-preset-env babel-preset-stage-0 babel-register eslint eslint-config-airbnb-base eslint-plugin-import eslint-plugin-jest jest superagent winston@next
```
## Dependencies
```
npm i aws-sdk bcrypt body-parser crypto dotenv express faker fs-extra http-errors jsonwebtoken mongoose multer twilio mongodb 
```
# Project Design
![Bloomio project design](./src/assets/bloomio-schema-diagram.JPG)
# API routes
  1. Account
    - POST /signup
      - success: returns 200 status code and an authorization token.
      - failure for bad request: returns 400 status code.
      - failure for duplicate key: returns 409 status code.
  2. Profile
    - POST /profile
     - success: 200 
    - GET /profile/:id
  3. Plant
    - POST /plant
    - GET /plant/:id
    - PUT /plant/id

# Version Release Schedule

## v 0.1.0
- 05-13-2018 2:53PM - Initial project scaffolding.
- 05-14-2018 10:30AM - Logger middleware added.
- 05-14-2018 10:40AM - Basic-auth middleware added.
- 05-14-2018 10:45AM - Bearer-auth middleware added.
- 05-14-2018 10:50AM - Error middleware added.
- 05-14-2018 10:55AM - S3 middleware added.
- 05-14-2018 11:00AM - Server and remaining dependencies added.
- 05-14-2018 11:40AM - Scaffolding finalized.
- 05-14-2018 1:04PM - Account Schema added.
- 05-14-2018 2:05PM - Profile Schema and Plant Schema added.
- 05-14-2018 4:05PM - Routes for Plant Schema finished.
- 05-14-2018 5:06PM - Profile GET route added.

## v 0.2.0

- 05-14-2018 8:32PM - Documentation reformatted.
- 05-14-2018 6:05PM - Tests for Plant Schema POST routes passing.
- 05-15-2018 9:44AM - Account PUT routes added/tests passing.
- 05-15-2018 10:04AM - Account DELETE routes added/tests passing.
- 05-15-2018 10:36AM - Profile 409 PUT test passing.
- 05-15-2018 11:30AM - Tests for Plant Schema GET and DELETE routes passing.
- 05-15-2018 01:36PM - PUT route for Plant Schema added and test passing.
- 05-15-2018 05:30PM - POST and GET route for plantBox are added and tested.


## v 0.3.0
- 05-16-2018 01:00PM - Updated plant Schema to store more details of watering schedule.
- 05-16-2018 01:00PM - Finished AWS to upload plant pictures.
- 05-16-2018 03:36PM - PlantResource Schema added and passing POST test.
- 05-16-2018 04:16PM - Function to create Date and calculate intervals created and tested
- 05-16-2018 04:30PM - Artillery tested.

## v 0.4.0

- 05-16-2018 6:36PM - GET route for PlantResource Schema created and tested.
- 05-17-2018 10:00AM - Readme updated.
- 05-17-2018 2:00PM - Artillery reports created.
- 05-17-2018 4:00PM - More tests added. Delete posthook fixed. Refactored PUT route to recalculate next water date when water interval is updated.
- 05-17-2018 4:30PM - Bloomio Graph ready.
- 05-17-2018 4:50PM - Twilio messages are being sent.






