'use strict';

const faker = require('faker');

const loadTestUser = module.exports = {};

loadTestUser.create = (userContext, events, done) => {
  // --------------------------ACCOUNT SCHEMA GENERATOR--------------------------------------------
  userContext.vars.username = faker.internet.userName() + Math.random().toString();
  userContext.vars.email = faker.internet.email();
  userContext.vars.password = faker.internet.password() + Math.random.toString();

  // --------------------------PROFILE SCHEMA GENERATOR--------------------------------------------
  userContext.vars.firstName = faker.name.firstName();
  userContext.vars.avatar = faker.image.imageUrl();
  userContext.vars.phoneNumber = faker.phone.phoneNumber();
  userContext.vars.location = faker.address.city();
  userContext.vars.googleID = faker.internet.email();

  return done();
};
