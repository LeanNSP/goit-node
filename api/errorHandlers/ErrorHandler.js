module.exports = class ErrorHandler extends Error {
  constructor(statusCode, message, res) {
    super(message);

    this.status = statusCode;
    delete this.stack;
    if (res) {
      res.status(statusCode).json({ message });
    }
  }
};
