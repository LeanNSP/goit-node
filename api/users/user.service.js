const userModel = require("./user.model");
const { deleteTempFile, getNonSecretUserInfo, minimizeImage } = require("../helpers");

require("dotenv").config();
const { AVATAR_DIR, PORT, SUBSCRIPTION_ENUM } = process.env;

module.exports = class UserService {
  /**
   * @param {Object} currentUser
   *
   * @returns {email, subscription}
   */
  static getCurrentUserNonSecretInfo(currentUser) {
    return getNonSecretUserInfo(currentUser);
  }

  /**
   * @param {string} subscription
   *
   * @returns {Promise<{[{email, subscription}, ...]}>}
   */
  static async getUsersBySubscription(subscription) {
    try {
      const users = await userModel.find({ subscription });

      return users.map(user => getNonSecretUserInfo(user));
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {string} subscription
   *
   */
  static validateBySubscriptionEnum(subscription) {
    const subEnum = SUBSCRIPTION_ENUM.split(" ");

    const result = subEnum.find(item => item === subscription);
    if (!result) {
      throw new Error();
    }
  }

  /**
   * @param {ObjectId} _id
   * @param {string} subscription
   *
   */
  static async updSubscription(_id, subscription) {
    try {
      await userModel.updSubscr(_id, subscription);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {ObjectId} _id
   * @param {string} path
   *
   *  @returns {Promise<{avatarURL: string}>}
   */
  static async updateAvatar(_id, path) {
    try {
      const avatarURL = `http://localhost:${PORT}${path}`;
      await userModel.updAvatar(_id, avatarURL);

      return avatarURL;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {string} filename
   * @param {string} path
   *
   * @returns {Promise<{path, destination}>}
   */
  static async minifyImage(filename, path) {
    try {
      await minimizeImage(filename);

      await deleteTempFile(path);

      return {
        path: `/${AVATAR_DIR}/${filename}`,
        destination: `public/${AVATAR_DIR}`,
      };
    } catch (error) {
      throw error;
    }
  }
};
