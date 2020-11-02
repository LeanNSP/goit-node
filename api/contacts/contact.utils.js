const path = require('path');
const { promises: fsPromises } = require('fs');

const NotFoundError = require('../errorHandlers/NotFoundError');

const contactsPath = path.join(__dirname, '../../db/contacts.json');

/**
 * @return {Promise<any>}
 */
async function readList() {
  try {
    const listStr = await fsPromises.readFile(contactsPath, 'utf-8');
    return JSON.parse(listStr);
  } catch (error) {
    throw error;
  }
}

/**
 * @param {Object} updList
 *
 * @return {Promise<any>}
 */
async function writeList(updList) {
  const rewrait = JSON.stringify(updList, null, 2);

  try {
    await fsPromises.writeFile(contactsPath, rewrait);
  } catch (error) {
    throw error;
  }
}

/**
 * @param {Object} body
 *
 * @return {number}
 */
function noEmptyBody(body) {
  return Object.keys(body).length;
}

/**
 * @param {Object} list
 * @param {number} contactId
 * @param {import('express').Response} res
 *
 * @return {number | Object}
 */
function checkIndexById(list, contactId, res) {
  const index = list.findIndex(({ id }) => id === contactId);

  if (index === -1) {
    res.status(404).json({ message: 'Not found' });
    throw new NotFoundError('Not found');
  }

  return index;
}

module.exports = {
  readList,
  writeList,
  noEmptyBody,
  checkIndexById,
};
