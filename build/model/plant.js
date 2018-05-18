'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _profile = require('./profile');

var _profile2 = _interopRequireDefault(_profile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var plantSchema = _mongoose2.default.Schema({
  plantNickname: {
    type: String
  },
  commonName: {
    type: String,
    required: true
  },
  scientificName: {
    type: String
  },
  groupType: {
    type: String
  },
  placement: {
    type: String,
    required: true
  },
  createdOn: {
    type: Date,
    default: function _default() {
      return new Date();
    }
  },
  lastWaterDate: {
    type: Date,
    default: function _default() {
      return new Date();
    }
  },
  waterInterval: {
    type: Number,
    default: 3
  },
  nextWaterDate: {
    type: Date
  },
  lastFertilizerDate: {
    type: Date
  },
  fertilizerInterval: {
    type: Number
  },
  nextFertilizerDate: {
    type: Date
  },
  lastMistingDate: {
    type: Date
  },
  mistingInterval: {
    type: Number
  },
  nextMistingDate: {
    type: Date
  },
  plantJournal: {
    type: String
  },
  image: {
    type: String
  },
  profile: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'profile',
    required: true
  }
});

plantSchema.methods.calculateNextWaterDate = function calculateNextWaterDate(newInterval) {
  var interval = this.waterInterval;
  if (newInterval) {
    interval = newInterval;
  }
  this.nextWaterDate = new Date((0, _moment2.default)(this.lastWaterDate).add(interval, 'days'));
  return this;
};

plantSchema.methods.isTimeToWater = function isTimeToWater() {
  var currentTime = (0, _moment2.default)();
  if (currentTime >= this.nextWaterDate) {
    return true;
  }return false;
};

function plantPreHook(done) {
  var _this = this;

  return _profile2.default.findById(this.profile).then(function (profileFound) {
    if (!profileFound) {
      throw new _httpErrors2.default(404, 'Profile not found.');
    }
    _this.calculateNextWaterDate();
    profileFound.planterBox.push(_this._id);
    return profileFound.save();
  }).then(function () {
    return done();
  });
}

var plantPostHook = function plantPostHook(document, done) {
  return _profile2.default.findById(document.profile).then(function (profileFound) {
    if (!profileFound) {
      throw new _httpErrors2.default(500, 'Profile not found in post hook.');
    }
    profileFound.planterBox = profileFound.planterBox.filter(function (plantId) {
      return plantId.toString() !== document._id.toString();
    });
  }).then(function () {
    return done();
  }).catch(done);
};

plantSchema.pre('save', plantPreHook);
plantSchema.post('remove', plantPostHook);

exports.default = _mongoose2.default.model('plant', plantSchema);