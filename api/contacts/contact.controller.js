const Joi = require("joi");

const contactUtils = require("./contact.utils");
const ServerError = require("../errorHandlers/ServerError");

module.exports = class ContactController {
    /**
     * @param {} req
     * @param {} res
     * @param {} next
     *
     * @returns {}
     */
    static async listContacts(req, res, next) {
        try {
            const list = await contactUtils.readList();
            return res.json(list);

        } catch (error) {
            next(new ServerError("problem on the server"));
        }
    }

    /**
     * @param {} req
     * @param {} res
     * @param {} next
     *
     * @returns {}
     */
    static async getContactById(req, res, next) {
        try {
            const contactId = parseInt(req.params.id);
            const list = await contactUtils.readList();

            const targetContactIndex = contactUtils.checkIndexById(list, contactId, res);

            return res.status(200).json(list[targetContactIndex]);

        } catch (error) {
            next(new ServerError("problem on the server"));
        }
    }

    /**
     * @param {} req
     * @param {} res
     * @param {} next
     *
     * @returns {}
     */
    static async addContact(req, res, next) {
        try {
            const list = await contactUtils.readList();
            const newContact = {
                ...req.body,
                id: list[list.length - 1].id + 1,
            }
            const updList = [...list, newContact];

            await contactUtils.writeList(updList);

            return res.status(201).json(newContact);

        } catch (error) {
            next(new ServerError("problem on the server"));
        }
    }

    /**
     * @param {} req
     * @param {} res
     * @param {} next
     *
     * @returns {}
     */
    static async removeContact(req, res, next) {
        try {
            const contactId = parseInt(req.params.id);
            const list = await contactUtils.readList();

            contactUtils.checkIndexById(list, contactId, res);

            const updList = list.filter(({ id }) => id !== contactId);

            await contactUtils.writeList(updList);

            return res.status(200).json({"message": "contact deleted"});

        } catch (error) {
            next(new ServerError("problem on the server"));
        }
    }
    
    /**
     * @param {} req
     * @param {} res
     * @param {} next
     *
     * @returns {}
     */
    static async updContact(req, res, next) {
        try {
            const contactId = parseInt(req.params.id);
            const list = await contactUtils.readList();

            const targetContactIndex = contactUtils.checkIndexById(list, contactId, res);
        
            list[targetContactIndex] = {
                ...list[targetContactIndex],
                ...req.body
            }
        
            await contactUtils.writeList(list);
        
            return res.status(200).json(list[targetContactIndex]);

        } catch (error) {
            next(new ServerError("problem on the server"));
        }
    }

    /**
     * @param {} req
     * @param {} res
     * @param {} next
     *
     * @returns {}
     */
    static validateAddContact(req, res, next) {
        const addContactRules = Joi.object({
            name: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.string().required(),
        })

        const result = addContactRules.validate(req.body);

        if (result.error) {
            return res.status(400).json({"message": "missing required name field"});
        }

        next();
    }
    
    /**
     * @param {} req
     * @param {} res
     * @param {} next
     *
     * @returns {}
     */
    static validateUpdContact(req, res, next) {
        const updContactRules = Joi.object({
            name: Joi.string(),
            email: Joi.string(),
            phone: Joi.string(),
        })

        const result = updContactRules.validate(req.body);

        if (result.error || !contactUtils.noEmptyBody(req.body)) {
            return res.status(400).json({"message": "missing fields"});
        }

        next();
    }

}
