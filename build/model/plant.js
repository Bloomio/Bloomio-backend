'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

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
    type: _mongoose2.default.Schema.Types.ObjectId
    // required: true,
  }
});

exports.default = _mongoose2.default.model('plant', plantSchema);