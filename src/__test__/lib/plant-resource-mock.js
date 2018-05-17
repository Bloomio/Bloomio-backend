'use strict';

import faker from 'faker';
import PlantResource from '../../model/plant-resource';

const createPlantResourceMock = () => {
  const resultMock = {};
  return new PlantResource({
    commonName: faker.lorem.words(2),
    scientificName: faker.lorem.words(2),
    groupType: faker.lorem.words(1),
    waterDate: faker.random.number(5),
    fertilizerDate: faker.random.number(5),
    mistingDate: faker.random.number(5),
  }).save()
    .then((plantResource) => {
      resultMock.plantResource = plantResource;
      return resultMock;
    });
};

const removePlantResourceMock = () => Promise.all([PlantResource.remove({})]);

export { createPlantResourceMock, removePlantResourceMock };
