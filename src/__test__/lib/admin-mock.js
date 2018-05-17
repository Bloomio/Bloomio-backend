'use strict';

import faker from 'faker';
import Profile from '../../model/profile';
import Account from '../../model/account';
import { removeAccountMock } from '../lib/account-mock';

const createAdminMock = () => {
  const resultMock = {};

  resultMock.request = {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.lorem.words(5),
  };
  return Account.create(
    resultMock.request.username, resultMock.request.email, 
    resultMock.request.password,
  )
    .then((account) => {
      resultMock.account = account;
      resultMock.account.isAdmin = true;
      return account.createToken();
    })
    .then((token) => {
      resultMock.token = token;
      return Account.findById(resultMock.account._id);
    })
    .then((account) => {
      resultMock.account = account;
      return resultMock;
    })
    .then((accountSetMock) => {
      resultMock.accountSetMock = accountSetMock;
      return new Profile({
        firstName: faker.name.firstName(),
        location: faker.address.zipCode(),
        avatar: faker.random.image(),
        phoneNumber: faker.phone.phoneNumber(),
        googleID: faker.internet.email(),
        account: accountSetMock.account._id,
      }).save()
        .then((profile) => {
          resultMock.profile = profile;
          return resultMock;
        });
    });
};

const removeAdminMock = () => {
  return Promise.all([
    Profile.remove({}),
    removeAccountMock(),
  ]);
};

export { createAdminMock, removeAdminMock };
