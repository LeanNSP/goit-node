const {
  Types: { ObjectId },
} = require("mongoose");

const contactModel = require("./contact.model");
const { noEmptyObject } = require("../helpers");

module.exports = class ContactService {
  /**
   * @param {number} page
   * @param {number} limit
   *
   * @returns {Promise<{[contacts]}>}
   */
  static async getContacts(page, limit) {
    try {
      const options = { page, limit };

      return await contactModel.paginate({}, options, (error, result) => result.docs);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {string} contactId
   *
   * @returns {Promise<{contact}>}
   */
  static async getContactById(contactId) {
    try {
      const desiredContact = await contactModel.findById(contactId);

      if (!desiredContact) {
        throw new Error();
      }

      return desiredContact;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {Object} contactData
   *
   * @returns {Promise<{contact}>}
   */
  static async addContact(contactData) {
    try {
      return await contactModel.create(contactData);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {string} contactId
   *
   * @returns {Promise<{contact}>}
   */
  static async removeContact(contactId) {
    try {
      const deletedContact = await contactModel.findByIdAndDelete(contactId);

      if (!deletedContact) {
        throw new Error();
      }
      return deletedContact;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {string} contactId
   * @param {Object} contactData
   *
   * @returns {Promise<{contact}>}
   */
  static async updContact(contactId, contactData) {
    try {
      const updatedContact = await contactModel.findContactByIdAndUpdate(contactId, contactData);

      if (!updatedContact) {
        throw new Error();
      }
      return updatedContact;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @param {Object} resultJoi
   *
   */
  static errorChecking(resultJoi) {
    if (resultJoi.error) {
      throw new Error();
    }
  }

  /**
   * @param {string} id
   *
   */
  static validateId(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error();
    }
  }

  /**
   * @param {Object} resultJoi
   * @param {Object} contactData
   *
   */
  static validateUpdContact(resultJoi, contactData) {
    if (resultJoi.error || !noEmptyObject(contactData)) {
      throw new Error();
    }
  }
};
