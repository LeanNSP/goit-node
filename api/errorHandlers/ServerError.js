module.exports = class ServerError extends Error {
  constructor(message) {
    super(message);

    this.status = 500;
    delete this.stack;
  }
};
