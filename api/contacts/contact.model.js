const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

contactSchema.statics.findContactByIdAndUpdate = findContactByIdAndUpdate;

async function findContactByIdAndUpdate(contactId, updParams) {
  return this.findByIdAndUpdate(contactId, { $set: updParams }, { new: true });
}

// contacts
const contactModel = mongoose.model('Contact', contactSchema);

module.exports = contactModel;
