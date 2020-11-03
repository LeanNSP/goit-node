const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const contactRouter = require('./contacts/contact.router');
const ServerError = require('./errorHandlers/ServerError');

require('dotenv').config();

module.exports = class PhonebookServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initLogger();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDB();
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
    this.server.use('/contacts', contactRouter);
  }
  // TODO
  async initDB() {
    try {
      // throw new Error();
      const connectDB = await mongoose.connect(process.env.MONGODB_URL);
      if (connectDB) {
        console.log('Database connection successful');
      }
    } catch (error) {
      new ServerError('problem on the server');
      // process.exit(1);
    }
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log(`Server started listening on port ${process.env.PORT}`);
    });
  }
};
