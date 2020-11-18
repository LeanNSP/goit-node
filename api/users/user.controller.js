const Joi = require("joi");

const userModel = require("./user.model");
const { deleteTempFile, minimizeImage, nonSecretUserInfo } = require("../helpers");
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
    try {
      const { _id } = req.user;
      const { subscription } = req.body;

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
  static async updateAvatar(req, res, next) {
    try {
      const { _id } = req.user;
      const { path } = req.file;

      const avatarURL = `http://localhost:${process.env.PORT}${path}`;
      await userModel.updAvatar(_id, avatarURL);

      return res.status(200).json({ avatarURL });
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

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async minifyImage(req, res, next) {
    try {
      if (req.file) {
        const { filename } = req.file;

        await minimizeImage(filename);

        await deleteTempFile(req);

        req.file = {
          ...req.file,
          path: `/${process.env.AVATAR_DIR}/${filename}`,
          destination: `public/${process.env.AVATAR_DIR}`,
        };
      }

      next();
    } catch (error) {
      next(error);
    }
  }
};
