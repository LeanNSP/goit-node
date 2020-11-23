const Joi = require("joi");

const UserService = require("./user.service");
const ErrorHandler = require("../errorHandlers/ErrorHandler");

module.exports = class UserController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static getCurrentUser(req, res, next) {
    const currentUser = req.user;

    const currentUserNonSecretInfo = UserService.getCurrentUserNonSecretInfo(currentUser);

    return res.status(200).json(currentUserNonSecretInfo);
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getUsersBySubscription(req, res, next) {
    try {
      const { sub } = req.query;

      const users = await UserService.getUsersBySubscription(sub);

      return res.status(200).json(users);
    } catch (error) {
      next(new ErrorHandler(500, "Filter error", res));
    }
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

      await UserService.updSubscription(_id, subscription);

      return res.status(204).send();
    } catch (error) {
      next(new ErrorHandler(500, "Error updating", res));
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
      const { filename, path } = req.file;

      req.file = {
        ...req.file,
        ...(await UserService.minifyImage(filename, path)),
      };

      const avatarURL = await UserService.updateAvatar(_id, req.file.path);

      return res.status(200).json({ avatarURL });
    } catch (error) {
      next(new ErrorHandler(400, "Invalid data", res));
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static validateBodySubscription(req, res, next) {
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
  static validateBodyBySubscriptionsEnum(req, res, next) {
    try {
      const { subscription } = req.body;

      UserService.validateBySubscriptionEnum(subscription);
    } catch (error) {
      next(new ErrorHandler(400, "Your subscription invalid.", res));
    }
    next();
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static validateQuerySub(req, res, next) {
    if (!req.query.sub) {
      throw new Error();
    }
    next();
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static validateQueryBySubscriptionsEnum(req, res, next) {
    try {
      const { sub } = req.query;

      UserService.validateBySubscriptionEnum(sub);
    } catch (error) {
      next(new ErrorHandler(400, "Your subscription invalid.", res));
    }
    next();
  }
};
