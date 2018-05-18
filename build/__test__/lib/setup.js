'use strict';

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _awsSdkMock = require('aws-sdk-mock');

var awsSDKMock = _interopRequireWildcard(_awsSdkMock);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

awsSDKMock.mock('S3', 'upload', function (params, callback) {
  if (!params.Key || !params.Bucket || !params.Body || !params.ACL) {
    return callback(new Error('SETUP AWS MOCK ERROR: key, bucket, body, or ACL required'));
  }
  if (params.ACL !== 'public-read') {
    return callback(new Error('SETUP AWS MOCK ERROR: ACL should be public-read'));
  }
  if (params.Bucket !== process.env.AWS_BUCKET) {
    return callback(new Error('SETUP AWS MOCK ERROR: wrong bucket.'));
  }
  return callback(null, { Location: _faker2.default.internet.url() });
});