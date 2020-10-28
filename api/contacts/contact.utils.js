const path = require('path');
const { promises: fsPromises } = require('fs');

const NotFoundError = require("../errorHandlers/NotFoundError");

const contactsPath = path.join(__dirname, "../../db/contacts.json");

/*
 * Makes a request to read the contacts.json file 
 * and passes the list of contacts in JSON format
 */
async function readList() {
    try {
        const listStr = await fsPromises.readFile(contactsPath, "utf-8");
        return JSON.parse(listStr);
    } catch (error) {
        throw error;
    }
}

/*
 * Writes the updated contact list to the database.
 */
async function writeList(updList) {
    const rewrait = JSON.stringify(updList, null, 2);

    try {
        await fsPromises.writeFile(contactsPath, rewrait);
    } catch (error) {
        throw error;
    }
}

/*
 * Checks whether the request body is not empty.
 */
function noEmptyBody(body) {
    return Object.keys(body).length;
}

/*
 * Checks whether there is a contact with the desired ID in the contact list.
 * If there is a contact, returns its ID.
 */
function checkIndexById(list, contactId, res) {
    const index = list.findIndex(({ id }) => id === contactId);
        
    if (index === -1) {
        res.status(404).json({"message": "Not found"});
        throw new NotFoundError("Not found");
    }

    return index;
}

module.exports = {
    readList,
    writeList,
    noEmptyBody,
    checkIndexById,
}