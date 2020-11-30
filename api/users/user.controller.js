const Joi = require("joi");

const { nonSecretUserInfo } = require("./user.utils");

const userModel = require("./user.model");
const ErrorHandler = require("../errorHandlers/ErrorHandler");

require("dotenv").config();

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

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getFilteredBySubscription(req, res, next) {
    try {
      const { sub } = req.query;
      const users = await userModel.find({ subscription: sub });
      const usersNonSecretsInfo = users.map(user => nonSecretUserInfo(user));

      return res.status(200).json(usersNonSecretsInfo);
    } catch (error) {}
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async updSubscription(req, res, next) {
    const { _id } = req.user;
    const { subscription } = req.body;
    console.log(_id);

    try {
      await userModel.updSubscr(_id, subscription);

      return res.status(204).send();
    } catch (error) {
      next(new ErrorHandler(401, "Not authorized", res));
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static validateSubscription(req, res, next) {
    const subscriptionRules = Joi.object({
      subscription: Joi.string().required(),
    });

    /**
     * @type {subscription: string}
     */
    const result = subscriptionRules.validate(req.body);
    if (result.error) {
      throw new ErrorHandler(400, "You entered invalid data.", res);
    }

    next();
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static validateSubscriptionEnum(req, res, next) {
    const { subscription } = req.body;
    const subEnum = process.env.SUBSCRIPTION_ENUM.split(" ");

    const result = subEnum.find(item => item === subscription);
    if (!result) {
      throw new ErrorHandler(400, "Your subscription invalid.", res);
    }

    next();
  }
};
