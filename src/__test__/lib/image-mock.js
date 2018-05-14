'use strict';

import faker from 'faker';
import { createAccountMock } from '../lib/account-mock';
import Image from '../../model/image';
import Account from '../../model/account';

const createImageMock = () => {
  const resultMock = {};
  return createAccountMock()
    .then((mockAccount) => {
      console.log('mockAccount', mockAccount);
      resultMock.accountMock = mockAccount;

      return new Image({
        title: faker.lorem.words(5),
        url: faker.random.image(),
        account: resultMock.accountMock.account._id,
      }).save();
    })
    .then((image) => {
      resultMock.image = image;
      return resultMock;
    });
};

const removeImageMock = () => Promise.all([Account.remove({}), Image.remove({})]);

export { createImageMock, removeImageMock };
