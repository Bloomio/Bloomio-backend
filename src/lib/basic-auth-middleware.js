'use strict';

import HttpError from 'http-errors';
import Account from '../model/account';

export default (request, response, next) => {
  if (!request.headers.authorization) {
    return next(new HttpError(400, 'AUTH - invalid request (!request.headers.authorization)'));
  }
  const base64AuthHeader = request.headers.authorization.split('Basic ')[1];
  if (!base64AuthHeader) {
    return next(new HttpError(400, 'AUTH - invalid request (!base64AuthHeader)'));
  }
  const stringAuthHeader = Buffer.from(base64AuthHeader, 'base64').toString();
  const [username, password] = stringAuthHeader.split(':');
  if (!username || !password) {
    return next(new HttpError(400, 'AUTH - invalid request (!username || !password)'));
  }
  return Account.findOne({ username })
    .then((account) => {
      if (!account) {
        return next(new HttpError(400, 'AUTH - invalid request (!account)'));
      }
      return account.verifyPassword(password);
    })
    .then((account) => {
      request.account = account;
      return next();
    })
    .catch(next);
};
