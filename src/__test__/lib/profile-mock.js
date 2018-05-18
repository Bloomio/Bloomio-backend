'use strict';

import faker from 'faker';
import Profile from '../../model/profile';
import { createAccountMock, removeAccountMock } from './account-mock';

const createProfileMock = () => {
  const resultMock = {};

  return createAccountMock()
    .then((accountSetMock) => {
      resultMock.accountSetMock = accountSetMock;
      return new Profile({
        firstName: faker.name.firstName(),
        location: faker.address.zipCode(),
        avatar: faker.random.image(),
        phoneNumber: faker.phone.phoneNumber(),
        googleID: faker.internet.email(),
        account: accountSetMock.account._id,
      }).save();
    })
    .then((profile) => {
      resultMock.profile = profile;
      return resultMock;
    });
};

const removeProfileMock = () => {
  return Promise.all([
    Profile.remove({}),
    removeAccountMock(),
  ]);
};

export { createProfileMock, removeProfileMock };
