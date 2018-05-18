'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var plantResourceSchema = _mongoose2.default.Schema({
  commonName: {
    type: String,
    required: true,
    unique: true
  },
  scientificName: {
    type: String,
    required: true,
    unique: true
  },
  groupType: {
    type: String,
    required: true
  },
  waterDate: {
    type: Number,
    required: true
  },
  fertilizerDate: {
    type: Number,
    required: true
  },
  mistingDate: {
    type: Number,
    required: true
  }
});

exports.default = _mongoose2.default.model('plantResource', plantResourceSchema);