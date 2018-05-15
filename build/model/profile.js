'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var profileSchema = _mongoose2.default.Schema({
  firstName: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  planterBox: [{
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'plant'
  }],
  location: {
    type: String,
    required: true
  },
  googleID: {
    type: String,
    unique: true
  },
  account: {
    type: _mongoose2.default.Schema.ObjectId,
    required: true,
    unique: true
  }
}, {
  usePushEach: true
});

exports.default = _mongoose2.default.model('profile', profileSchema);