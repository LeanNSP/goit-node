const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const userModel = require("../user.model");
const {
  checkUserByToken,
  createAvatar,
  deleteTempFile,
  getNonSecretUserInfo,
  getUserIdWithToken,
  sgEmailing,
} = require("../../helpers");

require("dotenv").config();
const { COST_FACTOR, PORT, JWT_SECRET } = process.env;

module.exports = class AuthService {
  /**
   * @param {string} password
   * @param {string} email
   * @param {string} path
   *
   * @returns {Promise<{email, subscription}>}
   */
  static async signUp(password, email, path) {
    try {
      const passwordHash = await bcryptjs.hash(password, parseInt(COST_FACTOR)); //COST_FACTOR - number of hashing cycles

      const verificationToken = uuidv4();

      const registeredUser = await userModel.create({
        email,
        passwordHash,
        avatarURL: `http://localhost:${PORT}${path}`,
        verificationToken,
      });

      await sgEmailing(email, verificationToken);

      return getNonSecretUserInfo(registeredUser);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {Object} user
   *
   * @returns {Promise<{email, subscription}>}
   */
  static getLoginedUserNonSecretInfo(user) {
    const userNonSecretInfo = getNonSecretUserInfo(user);

    return userNonSecretInfo;
  }

  /**
   * @param {ObjectId} _id
   *
   */
  static async logOut(_id) {
    try {
      await userModel.updToken(_id, null);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {string} verificationToken
   *
   */
  static async verifyEmail(verificationToken) {
    try {
      const user = await userModel.findUserByVerificationToken(verificationToken);

      if (!user) {
        throw new Error();
      }

      await userModel.deleteVerificationToken(user._id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {string} authorizationHeader
   *
   * @returns {Promise<{user}>}
   */
  static async autorize(authorizationHeader) {
    try {
      const token = authorizationHeader.replace("Bearer ", "");

      const userId = await getUserIdWithToken(token);

      const user = await userModel.findById(userId);

      checkUserByToken(user, token);

      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {string} email
   *
   * @returns {Promise<{user}>}
   */
  static async existingUserByEmail(email, filePath, need) {
    try {
      const existingUser = await userModel.findUserByEmail(email);

      if (!existingUser && need) {
        throw new Error();
      }
      if (existingUser && !need) {
        await deleteTempFile(filePath);
        throw new Error();
      }

      return existingUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {string} password
   * @param {string} passwordHash
   *
   * @returns {Promise<{user}>}
   */
  static async isPasswordValid(password, passwordHash) {
    try {
      const passwordValid = await bcryptjs.compare(password, passwordHash);
      if (!passwordValid) {
        throw new Error();
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {ObjectId} _id
   *
   * @returns {Promise<{token}>}
   */
  static async createToken(_id) {
    try {
      const token = jwt.sign({ id: _id }, JWT_SECRET, {
        expiresIn: 2 * 24 * 60 * 60, // token lifetime: 2 days * 24 hours * 60 minutes * 60 seconds
      });

      await userModel.updToken(_id, token);

      return token;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {string} resultJoi
   * @param {string} filePath
   *
   */
  static async errorChecking(resultJoi, filePath) {
    try {
      if (resultJoi.error) {
        if (filePath) {
          await deleteTempFile(filePath);
        }

        throw new Error();
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {string} email
   *
   * @returns {Promise<{avatar}>}
   */
  static async createDefaultAvatar(email) {
    try {
      return await createAvatar(email);
    } catch (error) {
      throw error;
    }
  }
};
