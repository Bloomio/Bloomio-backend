'use strict';

import faker from 'faker';
import Profile from '../../model/profile';
import { createAccountMock, removeAccountMock } from './account-mock';

const createAdminMock = () => {
  const resultMock = {};

  return createAccountMock()
    .then((accountSetMock) => {
      resultMock.accountSetMock = accountSetMock;
      resultMock.accountSetMock.isAdmin = true;
      console.log('mockADMIN', resultMock);
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

const removeAdminMock = () => {
  return Promise.all([
    Profile.remove({}),
    removeAccountMock(),
  ]);
};

export { createAdminMock, removeAdminMock };
