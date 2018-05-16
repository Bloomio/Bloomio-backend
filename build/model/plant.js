'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
    // required: true,
    default: function _default() {
      return new Date();
    }
  },
  waterDate: { // .pre before saving water schedule calculate the date intervals
    type: Number
    // required: true,
  },
  fertilizerDate: {
    type: Number
  },
  mistingDate: {
    type: Number
  },
  plantJournal: {
    type: Number
  },
  profile: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'profile'
    // required: true,
  }
});

function plantPreHook(done) {
  var _this = this;

  // done is using an (error, data) signature
  // here, the value 'contextual this' is the document.
  return _profile2.default.findById(this.profile).then(function (profileFound) {
    if (!profileFound) {
      throw new _httpErrors2.default(404, 'Profile not found.');
    }
    profileFound.planterBox.push(_this._id);
    return profileFound.save();
  }).then(function () {
    return done();
  }) // done without any arguments means success.
  .catch(done); // done with results mean an error
}

var plantPostHook = function plantPostHook(document, done) {
  return _profile2.default.findById(document.profile).then(function (profileFound) {
    if (!profileFound) {
      throw new _httpErrors2.default(500, 'Profile not found in post hook.');
    }
    profileFound.posts = profileFound.profiles.filter(function (profile) {
      return profile._id.toString() !== document._id.toString();
    });
  }).then(function () {
    return done();
  }).catch(done); // same as .catch(result => done(result))
};

plantSchema.pre('save', plantPreHook);
plantSchema.post('remove', plantPostHook);

exports.default = _mongoose2.default.model('plant', plantSchema);