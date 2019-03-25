var jwt = require("express-jwt")
var secret = require("../config").secret

function getToken(req) {
  const { authorization } = req.headers
  const splitHeader = authorization.split(' ')

  if (authorization && (splitHeader[0] === "Token" || splitHeader[0] === "Bearer") ) {
    return splitHeader[1]
  }

  return null
}

module.exports = {
  required: jwt({
    secret,
    userProperty: "auth",
    getToken
  }),
  optional: jwt({
    secret,
    userProperty: "auth",
    credentialsRequired: false,
    getToken
  })
}
