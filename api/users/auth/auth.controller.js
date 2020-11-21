const Joi = require("joi");

const AuthService = require("./auth.service");
const UserService = require("../user.service");
const ErrorHandler = require("../../errorHandlers/ErrorHandler");

module.exports = class AuthController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async registerUser(req, res, next) {
    try {
      const { password, email } = req.body;

      if (!req.file) {
        req.file = { ...(await AuthService.createDefaultAvatar(email)) };
      }
      const { filename, path } = req.file;

      req.file = {
        ...req.file,
        ...(await UserService.minifyImage(filename, path)),
      };

      const registeredUserNonSecretInfo = await AuthService.signUp(password, email, path);

      return res.status(201).json(registeredUserNonSecretInfo);
    } catch (error) {
      next(new ErrorHandler(500, "User registration error", res));
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;

      const existingUser = await AuthService.existingUserByEmail(email, null, true);
      const { _id, passwordHash } = existingUser;

      await AuthService.isPasswordValid(password, passwordHash);

      const token = await AuthService.createToken(_id);

      const user = AuthService.getLoginedUserNonSecretInfo(existingUser);

      return res.status(200).json({ token, user });
    } catch (error) {
      next(new ErrorHandler(401, "Email or password is wrong", res));
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async logoutUser(req, res, next) {
    try {
      const { _id } = req.user;

      await AuthService.logOut(_id);

      return res.status(204).send();
    } catch (error) {
      next(new ErrorHandler(500, "User logout error", res));
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get("Authorization");

      const user = await AuthService.autorize(authorizationHeader);

      req.user = user;

      next();
    } catch (error) {
      next(new ErrorHandler(401, "Not authorized", res));
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async validateEmailAndPassword(req, res, next) {
    const emailAndPasswordRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    /**
     * @type {email: string, password: string}
     */
    const result = emailAndPasswordRules.validate(req.body);
    const filePath = req.file ? req.file.path : null;

    try {
      await AuthService.errorChecking(result, filePath);
    } catch (error) {
      next(new ErrorHandler(400, "You entered invalid data.", res));
    }

    next();
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async validateUniqueEmail(req, res, next) {
    try {
      const { email } = req.body;
      const filePath = req.file ? req.file.path : null;

      await AuthService.existingUserByEmail(email, filePath, false);

      next();
    } catch (error) {
      next(new ErrorHandler(409, "Email in use", res));
    }
  }
};
