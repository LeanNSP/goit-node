const { Router } = require('express');

const ContactController = require('./contact.controller');

const contactRouter = Router();

contactRouter.get('/', ContactController.getContacts);

contactRouter.get('/:id', ContactController.validateId, ContactController.getContactById);

contactRouter.post('/', ContactController.validateAddContact, ContactController.addContact);

contactRouter.delete('/:id', ContactController.validateId, ContactController.removeContact);

contactRouter.patch(
  '/:id',
  ContactController.validateId,
  ContactController.validateUpdContact,
  ContactController.updContact,
);

module.exports = contactRouter;
