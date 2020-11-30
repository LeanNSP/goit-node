const Joi = require("joi");

const ContactService = require("./contact.service");
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

      const contacts = await ContactService.getContacts(page, limit);
      console.log(contacts);

      return res.status(200).json(contacts);
    } catch (error) {
      next(new ErrorHandler(500, "Request completed with error", res));
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getContactById(req, res, next) {
    try {
      const { id } = req.params;

      const desiredContact = await ContactService.getContactById(id);

      return res.status(200).json(desiredContact);
    } catch (error) {
      next(new ErrorHandler(404, "Not found", res));
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async addContact(req, res, next) {
    try {
      const contactData = req.body;

      const newContact = await ContactService.addContact(contactData);

      return res.status(201).json(newContact);
    } catch (error) {
      next(new ErrorHandler(500, "Contact not created", res));
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async removeContact(req, res, next) {
    try {
      const { id } = req.params;

      const deletedContact = await ContactService.removeContact(id);

      return res.status(200).json(deletedContact);
    } catch (error) {
      next(new ErrorHandler(404, "Not found", res));
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async updContact(req, res, next) {
    try {
      const { id } = req.params;

      const updatedContact = await ContactService.updContact(id, req.body);

      return res.status(200).json(updatedContact);
    } catch (error) {
      next(new ErrorHandler(404, "Not found", res));
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static validateId(req, res, next) {
    try {
      const { id } = req.params;

      ContactService.validateId(id);
    } catch (error) {
      next(new ErrorHandler(400, "Bad Request", res));
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

    try {
      ContactService.errorChecking(result);
    } catch (error) {
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

    try {
      ContactService.validateUpdContact(result, req.body);
    } catch (error) {
      next(new ErrorHandler(400, "missing fields", res));
    }

    next();
  }
};
