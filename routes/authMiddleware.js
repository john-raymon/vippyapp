var jwt = require("express-jwt")
var secret = require("../config").secret

function getToken(req){
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
      req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
}

var auth = {
  required: jwt({
    secret: secret,
    userProperty: "auth",
    getToken: getToken
  }),
  optional: jwt({
    secret: secret,
    userProperty: "auth",
    credentialsRequired: false,
    getToken: getToken
  })
}

module.exports = auth
