const Joi = require("joi");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userModel = require("../user.model");
const {
  checkUserByToken,
  createAvatar,
  deleteTempFile,
  getUserIdWithToken,
  nonSecretUserInfo,
} = require("../../helpers");
const ErrorHandler = require("../../errorHandlers/ErrorHandler");

require("dotenv").config();

module.exports = class AuthController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async registerUser(req, res, next) {
    try {
      const { password, email } = req.body;
      const { COST_FACTOR, PORT } = process.env;

      const passwordHash = await bcryptjs.hash(password, parseInt(COST_FACTOR)); //COST_FACTOR - number of hashing cycles

      const registeredUser = await userModel.create({
        email,
        passwordHash,
        avatarURL: `http://localhost:${PORT}${req.file.path}`,
      });

      return res.status(201).json(nonSecretUserInfo(registeredUser));
    } catch (error) {
      next(new ErrorHandler(503, "Service Unavailable", res));
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async loginUser(req, res, next) {
    try {
      const { email } = req.body;

      const userWithAnUpdatedToken = await userModel.findUserByEmail(email);
      const { token } = userWithAnUpdatedToken;
      const user = nonSecretUserInfo(userWithAnUpdatedToken);

      return res.status(200).json({ token, user });
    } catch (error) {
      next(new ErrorHandler(503, "Service Unavailable", res));
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
      await userModel.updToken(_id, null);

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
  static async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get("Authorization");
      const token = authorizationHeader.replace("Bearer ", "");

      const userId = await getUserIdWithToken(token);

      const user = await userModel.findById(userId);
      checkUserByToken(user);

      req.user = user;
      req.token = token;

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
  static async existingUserByEmail(req, res, next) {
    try {
      const { email } = req.body;

      const existingUser = await userModel.findUserByEmail(email);
      if (!existingUser) {
        throw new ErrorHandler(401, "Email or password is wrong", res);
      }
      req.existingUser = existingUser;

      next();
    } catch (error) {
      next(error);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async isPasswordValid(req, res, next) {
    try {
      const { password } = req.body;
      const { passwordHash } = req.existingUser;

      const isPasswordValid = await bcryptjs.compare(password, passwordHash);
      if (!isPasswordValid) {
        throw new ErrorHandler(401, "Email or password is wrong", res);
      }

      next();
    } catch (error) {
      next(error);
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async generateAndUpdateToken(req, res, next) {
    try {
      const { _id } = req.existingUser;

      const token = jwt.sign({ id: _id }, process.env.JWT_SECRET, {
        expiresIn: 2 * 24 * 60 * 60, // token lifetime: 2 days * 24 hours * 60 minutes * 60 seconds
      });

      await userModel.updToken(_id, token);

      next();
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static validateEmailAndPassword(req, res, next) {
    const emailAndPasswordRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    /**
     * @type {email: string, password: string}
     */
    const result = emailAndPasswordRules.validate(req.body);

    if (result.error) {
      clearTempDir(req);
      throw new ErrorHandler(400, "You entered invalid data.", res);
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

      const existingUser = await userModel.findUserByEmail(email);

      if (existingUser) {
        deleteTempFile(req);
        throw new ErrorHandler(409, "Email in use", res);
      }
    } catch (error) {
      next(error);
    }

    next();
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async defaultAvatar(req, res, next) {
    try {
      const { email } = req.body;
      if (!req.file) {
        const avatar = await createAvatar(email);

        req.file = { ...avatar };
      }
      next();
    } catch (error) {
      next(error);
    }
  }
};
