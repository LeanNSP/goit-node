const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const contactRouter = require('./contacts/contact.router');

require('dotenv').config();

module.exports = class PhonebookServer {
  constructor() {
    this.server = null;
  }

  start() {
    this.initServer();
    this.initLogger();
    this.initMiddlewares();
    this.initRoutes();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initLogger() {
    this.server.use(morgan('dev'));
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors({ origin: 'http://localhost:3100' }));
  }

  initRoutes() {
    this.server.use('/api/contacts', contactRouter);
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log(`Server started listening on port ${process.env.PORT}`);
    });
  }
};
