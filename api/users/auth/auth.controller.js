const Joi = require('joi');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userModel = require('../user.model');
const { nonSecretUserInfo } = require('../user.utils');
const ErrorHandler = require('../../errorHandlers/ErrorHandler');

const COST_FACTOR = 6; // number of hashing cycles

module.exports = class AuthController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async registerUser(req, res, next) {
    const { password, email } = req.body;

    try {
      const passwordHash = await bcryptjs.hash(password, COST_FACTOR);

      const registeredUser = await userModel.create({
        email,
        passwordHash,
      });

      return res.status(201).json(nonSecretUserInfo(registeredUser));
    } catch (error) {
      next(new ErrorHandler(503, 'Service Unavailable', res));
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async loginUser(req, res, next) {
    const { password, email } = req.body;

    try {
      const existingUser = await userModel.findUserByEmail(email);

      if (!existingUser) {
        throw new ErrorHandler(401, 'Email or password is wrong', res);
      }

      const isPasswordValid = await bcryptjs.compare(password, existingUser.passwordHash);

      if (!isPasswordValid) {
        throw new ErrorHandler(401, 'Email or password is wrong', res);
      }

      const { _id } = existingUser;
      const token = jwt.sign({ id: _id }, 'lareuargs');

      await userModel.updToken(_id, token);

      const userWithAnUpdatedToken = await userModel.findUserByEmail(email);

      return res
        .status(200)
        .json({ token, user: { ...nonSecretUserInfo(userWithAnUpdatedToken) } });
    } catch (error) {
      next(new ErrorHandler(503, 'Service Unavailable', res));
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static validateEmailAndPassword(req, res, next) {
    const registerUserRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    /**
     * @type {name: string, email: string, phone: string,}
     */
    const result = registerUserRules.validate(req.body);

    if (result.error) {
      throw new ErrorHandler(400, 'You entered invalid data.', res);
    }

    next();
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async validateUniqueEmail(req, res, next) {
    const { email } = req.body;

    try {
      const existingUser = await userModel.findUserByEmail(email);

      if (existingUser) {
        throw new ErrorHandler(409, 'Email in use', res);
      }
    } catch (error) {
      next(error);
    }

    next();
  }
};
