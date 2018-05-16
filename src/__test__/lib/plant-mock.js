'use strict';

import faker from 'faker';
import { createProfileMock } from '../lib/profile-mock';
import Plant from '../../model/plant';
import Account from '../../model/account';

const createPlantMock = () => {
  const resultMock = {};
  return createProfileMock()
    .then((mockProfile) => {
      resultMock.profileMock = mockProfile;
      return new Plant({
        plantNickname: faker.lorem.words(2),
        commonName: faker.lorem.words(2),
        scientificName: faker.lorem.words(2),
        groupType: faker.lorem.words(2),
        placement: faker.lorem.words(2),
        image: faker.random.image(),
        profile: resultMock.profileMock.profile._id,
      }).save();
    })
    .then((plant) => {
      resultMock.plant = plant;
      return resultMock;
    });
};

const removePlantMock = () => Promise.all([Account.remove({}), Plant.remove({})]);

export { createPlantMock, removePlantMock };
