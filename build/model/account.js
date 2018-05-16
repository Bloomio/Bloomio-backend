'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HASH_ROUNDS = 8;
var TOKEN_SEED_LENGTH = 128;

var accountSchema = _mongoose2.default.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdOn: {
    type: Date,
    default: function _default() {
      return new Date();
    }
  }
});

function verifyPassword(password) {
  var _this = this;

  return _bcrypt2.default.compare(password, this.passwordHash).then(function (result) {
    if (!result) {
      throw new _httpErrors2.default(400, 'AUTH - incorrect data.');
    }
    return _this;
  });
}

function createToken() {
  this.tokenSeed = _crypto2.default.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
  return this.save().then(function (account) {
    return _jsonwebtoken2.default.sign({ tokenSeed: account.tokenSeed }, process.env.BLOOMIO_SECRET);
  }).catch(function () {
    createToken();
  });
}

accountSchema.methods.verifyPassword = verifyPassword;
accountSchema.methods.createToken = createToken;

var Account = _mongoose2.default.model('account', accountSchema);

Account.create = function (username, email, password) {
  return _bcrypt2.default.hash(password, HASH_ROUNDS).then(function (passwordHash) {
    password = null; // eslint-disable-line
    var tokenSeed = _crypto2.default.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
    return new Account({
      username: username,
      email: email,
      passwordHash: passwordHash,
      tokenSeed: tokenSeed
    }).save();
  });
};

exports.default = Account;