const jwt = require("jsonwebtoken");

require("dotenv").config();

const { JWT_SECRET } = process.env;

module.exports = async function getUserIdWithToken(token) {
  try {
    console.log("token", token);
    console.log(JWT_SECRET);
    return await jwt.verify(token, JWT_SECRET).id;
  } catch (error) {
    throw new Error();
  }
};
