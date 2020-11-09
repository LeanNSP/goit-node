module.exports = class ErrorHandler extends Error {
  constructor(statusCode, message, res) {
    super(message);

    this.status = statusCode;
    delete this.stack;

    console.log('\x1b[31m%s\x1b[0m', `${statusCode} ${message}`);

    if (res) {
      res.status(statusCode).json({ message });
    }
  }
};
