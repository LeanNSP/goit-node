'use strict';

const argv = require('yargs').argv;
const contacts = require("./contacts");

async function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case 'list':
      const list = await contacts.listContacts();

      console.table(list);
      break;

    case 'get':
      const getContact = await contacts.getContactById(id);

      getContact ? console.table(getContact) : console.log(`No contact with this id: ${id}`);

      break;

    case 'add':
      const addedContact = await contacts.addContact(name, email, phone);

      console.group();
      console.table(addedContact);
      console.log("Сontact added successfully.");
      console.groupEnd();
      break;

    case 'remove':
      const onRemove = await contacts.removeContact(id);
      const message = onRemove ? "Сontact deleted successfully." : `No contact with this id: ${id}`;

      console.log(message);
      break;

    default:
      console.warn('\x1B[31m Unknown action type!');
  }
}

invokeAction(argv);
