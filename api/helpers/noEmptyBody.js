/**
 * @param {Object} body
 *
 * @return {number}
 */
module.exports = function noEmptyBody(body) {
  return Object.keys(body).length;
};
