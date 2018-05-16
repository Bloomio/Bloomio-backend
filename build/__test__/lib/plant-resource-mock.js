'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removePlantResourceMock = exports.createPlantResourceMock = undefined;

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _plantResource = require('../../model/plant-resource');

var _plantResource2 = _interopRequireDefault(_plantResource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createPlantResourceMock = function createPlantResourceMock() {
  var resultMock = {};
  return new _plantResource2.default({
    commonName: _faker2.default.lorem.words(2),
    scientificName: _faker2.default.lorem.words(2),
    groupType: _faker2.default.lorem.words(1),
    waterDate: _faker2.default.random.number(5),
    fertilizerDate: _faker2.default.random.number(5),
    mistingDate: _faker2.default.random.number(5)
  }).save().then(function (plantResource) {
    resultMock.plantResource = plantResource;
    return resultMock;
  });
};

var removePlantResourceMock = function removePlantResourceMock() {
  return Promise.all([_plantResource2.default.remove({})]);
};

exports.createPlantResourceMock = createPlantResourceMock;
exports.removePlantResourceMock = removePlantResourceMock;