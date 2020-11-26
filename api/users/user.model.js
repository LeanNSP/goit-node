const mongoose = require("mongoose");
const { Schema } = mongoose;

require("dotenv").config();

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  avatarURL: { type: String },
  subscription: {
    type: String,
    enum: process.env.SUBSCRIPTION_ENUM.split(" "),
    default: "free",
  },
  token: { type: String },
  verificationToken: { type: String },
});

userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.findUserByVerificationToken = findUserByVerificationToken;
userSchema.statics.updToken = updToken;
userSchema.statics.updSubscr = updSubscr;
userSchema.statics.updAvatar = updAvatar;
userSchema.statics.deleteVerificationToken = deleteVerificationToken;

async function findUserByEmail(email) {
  return this.findOne({ email });
}

async function findUserByVerificationToken(verificationToken) {
  return this.findOne({ verificationToken });
}

async function updToken(id, newToken) {
  return this.findByIdAndUpdate(id, { token: newToken });
}

async function updSubscr(id, subscription) {
  return this.findByIdAndUpdate(id, { subscription });
}

async function updAvatar(id, avatarURL) {
  return this.findByIdAndUpdate(id, { avatarURL });
}

async function deleteVerificationToken(id) {
  return this.findByIdAndUpdate(id, { verificationToken: null });
}

// users
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
