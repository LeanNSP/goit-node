const { nonSecretUserInfo } = require('./user.utils');

module.exports = class UserController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static getCurrentUser(req, res, next) {
    const currentUser = req.user;

    return res.status(200).json(nonSecretUserInfo(currentUser));
  }
};
