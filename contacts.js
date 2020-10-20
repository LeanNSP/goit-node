const path = require('path');
const { promises: fsPromises } = require('fs');

const contactsPath = path.join(__dirname, "./db/contacts.json");

// TODO: задокументировать каждую функцию
/*
 * Makes a request to read the contacts.json file 
 * and passes the list of contacts in JSON format
 */
async function listContacts() {
    const listStr = await fsPromises.readFile(contactsPath, "utf-8");

    return JSON.parse(listStr);
}

/*
 * Looking for a contact by id in the contact list.
 * Return it if found, return null if not found.
 */
async function getContactById(contactId) {
    const list = await listContacts();

    if (checkedID(list, contactId)) {
      return list.find(({ id }) => id === contactId);
    }

    return  null;
}
  
/*
 * Deleting a contact by id.
 * If the contact is in the contact list, delete it and return true.
 * If it is not in the contact list, it returns false.
 */
async function removeContact(contactId) {
    const list = await listContacts();

    if (checkedID(list, contactId)) {
      const updList = list.filter(({ id }) => id !== contactId);
      const rewrait = JSON.stringify(updList, null, 2);

      await fsPromises.writeFile(contactsPath, rewrait);

      return true;
    }

    return false;
}
  
/*
 * Create a new contact and add it to the contact list.
 * Return this new contact.
 */
async function addContact(name, email, phone) {
    const list = await listContacts();

    const id = list[list.length - 1].id + 1;
    const newContact = { id, name, email, phone };

    const updList = [...list, newContact];
    const rewrait = JSON.stringify(updList, null, 2);

    await fsPromises.writeFile(contactsPath, rewrait);

    return newContact;
}

/*
 * Checked the contact list by id.
 * If the id is found, return true.
 * If the id is not found, it return false.
 */
const checkedID = (list, contactId) => list.some(({ id }) => id === contactId);

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
}
