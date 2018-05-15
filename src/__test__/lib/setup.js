'use strict';

import faker from 'faker';
import * as awsSDKMock from 'aws-sdk-mock';

awsSDKMock.mock('S3', 'upload', (params, callback) => {
  // params is equal to whatever options you passed into the original method
  // params in this case is equal to "uploadOptions" back in s3Upload
  if (!params.Key || !params.Bucket || !params.Body || !params.ACL) {
    return callback(new Error('SETUP AWS MOCK ERROR: key, bucket, body, or ACL required'));
  }
  if (params.ACL !== 'public-read') {
    return callback(new Error('SETUP AWS MOCK ERROR: ACL should be public-read'));
  }
  if (params.Bucket !== process.env.AWS_BUCKET) {
    return callback(new Error('SETUP AWS MOCK ERROR: wrong bucket.'));
  }
  // this callback as the signature of (error, data).
  return callback(null, { Location: faker.internet.url() });
});

awsSDKMock.mock('S3', 'deleteObject', (params, callback) => {
  if (!params.Key || !params.Bucket) {
    return callback(new Error('SETUP AWS MOCK ERROR: key and bucket required.'));
  }
  if (params.Bucket !== process.env.AWS_BUCKET) {
    return callback(new Error('SETUP AWS MOCK ERROR: wrong bucket.'));
  }

  return callback(null, {});
});
