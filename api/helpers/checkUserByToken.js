module.exports = function checkUserByToken(user) {
  if (!user || user.token !== token) {
    throw new Error();
  }
};
