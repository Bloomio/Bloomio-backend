'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _twilio = require('twilio');

var _twilio2 = _interopRequireDefault(_twilio);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var accountSID = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
var client = new _twilio2.default(accountSID, authToken);

var sendText = function sendText(profile, message) {
  client.messages.create({
    body: message,
    from: process.env.TWILIO_NUMBER,
    to: process.env.TELEPHONE_NUMBER
  }).then(function (Twiliomessage) {
    return _logger2.default.log(_logger2.default.INFO, Twiliomessage.sid + ' and profile is ' + profile);
  }).done();
};

exports.default = sendText;