const jwt = require("jsonwebtoken");

require("dotenv").config();

const { JWT_SECRET } = process.env;

module.exports = async function getUserIdWithToken(token) {
  try {
    return await jwt.verify(token, JWT_SECRET).id;
  } catch (error) {
    throw new Error();
  }
};
