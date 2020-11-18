const Joi = require("joi");
const {
  Types: { ObjectId },
} = require("mongoose");

const contactModel = require("./contact.model");
const { noEmptyBody } = require("../helpers");
const ErrorHandler = require("../errorHandlers/ErrorHandler");

module.exports = class ContactController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getContacts(req, res, next) {
    try {
      const { page, limit } = req.query;
      const options = { page, limit };

      const contacts = await contactModel.paginate({}, options, (error, result) => result.docs);

      return res.status(200).json(contacts);
    } catch (error) {
      next(new ErrorHandler(503, "Service Unavailable", res));
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getContactById(req, res, next) {
    try {
      const contactId = req.params.id;

      const desiredContact = await contactModel.findById(contactId);

      if (!desiredContact) {
        throw new ErrorHandler(404, "Not found", res);
      }

      return res.status(200).json(desiredContact);
    } catch (error) {
      next(new ErrorHandler(503, "Service Unavailable", res));
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async addContact(req, res, next) {
    try {
      const newContact = await contactModel.create(req.body);

      return res.status(201).json(newContact);
    } catch (error) {
      next(new ErrorHandler(503, "Service Unavailable", res));
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async removeContact(req, res, next) {
    try {
      const contactId = req.params.id;

      const deletedContact = await contactModel.findByIdAndDelete(contactId);

      if (!deletedContact) {
        throw new ErrorHandler(404, "Not found", res);
      }

      return res.status(200).json(deletedContact);
    } catch (error) {
      next(new ErrorHandler(503, "Service Unavailable", res));
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async updContact(req, res, next) {
    try {
      const contactId = req.params.id;

      const updatedContact = await contactModel.findContactByIdAndUpdate(contactId, req.body);

      if (!updatedContact) {
        throw new ErrorHandler(404, "Not found", res);
      }

      return res.status(200).json(updatedContact);
    } catch (error) {
      next(new ErrorHandler(503, "Service Unavailable", res));
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static validateId(req, res, next) {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      throw new ErrorHandler(400, "Bad Request", res);
    }

    next();
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static validateAddContact(req, res, next) {
    const addContactRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });

    /**
     * @type {name: string, email: string, phone: string,} ContactRequestPayload
     */
    const result = addContactRules.validate(req.body);

    if (result.error) {
      throw new ErrorHandler(400, "missing required name field", res);
    }

    next();
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static validateUpdContact(req, res, next) {
    const updContactRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    });

    /**
     * @type {name: string, email: string, phone: string,} ContactRequestPayload
     */
    const result = updContactRules.validate(req.body);

    if (result.error || !noEmptyBody(req.body)) {
      throw new ErrorHandler(400, "missing fields", res);
    }

    next();
  }
};
