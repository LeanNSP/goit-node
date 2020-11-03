const Joi = require('joi');
const {
  Types: { ObjectId },
} = require('mongoose');

const contactModel = require('./contact.model');
const contactUtils = require('./contact.utils');
const ServerError = require('../errorHandlers/ServerError');

module.exports = class ContactController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getContacts(req, res, next) {
    try {
      const contacts = await contactModel.find();

      return res.status(200).json(contacts);
    } catch (error) {
      next(new ServerError('problem on the server'));
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
        res.status(404).json({ message: 'Not found' });
        throw new NotFoundError('Not found');
      }

      return res.status(200).json(desiredContact);
    } catch (error) {
      next(new ServerError('problem on the server'));
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
      next(new ServerError('problem on the server'));
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
      console.log(deletedContact);

      if (!deletedContact) {
        res.status(404).json({ message: 'Not found' });
        throw new NotFoundError('Not found');
      }

      return res.status(200).json(deletedContact);
    } catch (error) {
      next(new ServerError('problem on the server'));
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
        res.status(404).json({ message: 'Not found' });
        throw new NotFoundError('Not found');
      }

      return res.status(200).json(updatedContact);
    } catch (error) {
      next(new ServerError('problem on the server'));
    }
  }

  static validateId(req, res, next) {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send();
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
      return res.status(400).json({ message: 'missing required name field' });
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

    if (result.error || !contactUtils.noEmptyBody(req.body)) {
      return res.status(400).json({ message: 'missing fields' });
    }

    next();
  }
};
