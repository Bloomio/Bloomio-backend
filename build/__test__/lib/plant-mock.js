'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removePlantMock = exports.createPlantMock = undefined;

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _profileMock = require('../lib/profile-mock');

var _plant = require('../../model/plant');

var _plant2 = _interopRequireDefault(_plant);

var _account = require('../../model/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createPlantMock = function createPlantMock() {
  var resultMock = {};
  return (0, _profileMock.createProfileMock)().then(function (mockProfile) {
    resultMock.profileMock = mockProfile;
    return new _plant2.default({
      plantNickname: _faker2.default.lorem.words(2),
      commonName: _faker2.default.lorem.words(2),
      scientificName: _faker2.default.lorem.words(2),
      groupType: _faker2.default.lorem.words(2),
      placement: _faker2.default.lorem.words(2),
      image: _faker2.default.random.image(),
      profile: resultMock.profileMock.profile._id
    }).save();
  }).then(function (plant) {
    resultMock.plant = plant;
    return resultMock;
  });
};

var removePlantMock = function removePlantMock() {
  return Promise.all([_account2.default.remove({}), _plant2.default.remove({})]);
};

exports.createPlantMock = createPlantMock;
exports.removePlantMock = removePlantMock;