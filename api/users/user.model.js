const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  subscription: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free',
  },
  token: { type: String },
});

userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.updToken = updToken;

async function findUserByEmail(email) {
  return this.findOne({ email });
}

async function updToken(id, newToken) {
  return this.findByIdAndUpdate(id, { token: newToken });
}

// users
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
