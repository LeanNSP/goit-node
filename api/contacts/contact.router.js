const { Router } = require('express');

const ContactController = require('./contact.controller');

const contactRouter = Router();

contactRouter.get('/', ContactController.listContacts);

contactRouter.get('/:id', ContactController.getContactById);

contactRouter.post('/', ContactController.validateAddContact, ContactController.addContact);

contactRouter.delete('/:id', ContactController.removeContact);

contactRouter.patch('/:id', ContactController.validateUpdContact, ContactController.updContact);

module.exports = contactRouter;
