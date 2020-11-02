module.exports = class NotFoundError extends Error {
  constructor(message) {
    super(message);

    this.status = 404;
    delete this.stack;
  }
};
