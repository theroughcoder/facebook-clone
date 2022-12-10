const jwt = require( "jsonwebtoken");

 const generateToken = (user, expired) => {
  return jwt.sign(user, process.env.JWT_SECRET, {expiresIn: expired, });
};

module.exports = {generateToken}
