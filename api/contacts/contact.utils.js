/**
 * @param {Object} body
 *
 * @return {number}
 */
function noEmptyBody(body) {
  return Object.keys(body).length;
}

module.exports = {
  noEmptyBody,
};
