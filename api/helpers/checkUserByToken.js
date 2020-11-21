module.exports = function checkUserByToken(user, token) {
  if (!user || user.token !== token) {
    throw new Error();
  }
};
