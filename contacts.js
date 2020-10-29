const path = require('path');
const { promises: fsPromises } = require('fs');

const contactsPath = path.join(__dirname, "./db/contacts.json");

/**
 * @return {Object}
 */
async function listContacts() {
    const listStr = await fsPromises.readFile(contactsPath, "utf-8");

    return JSON.parse(listStr);
}

/**
 * @param {number} contactId
 * @return {Object | null}
 */
async function getContactById(contactId) {
    const list = await listContacts();

    if (checkedID(list, contactId)) {
      return list.find(({ id }) => id === contactId);
    }

    return  null;
}
  
/**
 * @param {number} contactId
 * @return {boolean}
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
  
/**
 * @param {string} name
 * @param {string} email
 * @param {string} phone
 * @return {Object}
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

/**
 * @param {Object<Array>} list
 * @param {number} contactId
 * @return {boolean}
 */
const checkedID = (list, contactId) => list.some(({ id }) => id === contactId);

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
}
