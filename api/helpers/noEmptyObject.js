/**
 * @param {Object} body
 *
 * @return {number}
 */
module.exports = function noEmptyObject(body) {
  return Object.keys(body).length;
};
