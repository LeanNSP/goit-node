const sgMail = require("@sendgrid/mail");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const { PORT, SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

module.exports = async function sgEmailing(toEmail, verificationToken) {
  const verificationURL = `http://localhost:${PORT}/auth/verify/${verificationToken}`;

  const msg = {
    to: toEmail,
    from: "mailing127@gmail.com",
    subject: "Phonebook: verify email",
    text: `Please verify your email address by clicking on this link:${verificationURL}`,
    html: `<a href="${verificationURL}">Please verify your email address by clicking on me</a>`,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    throw Error();
  }
};
