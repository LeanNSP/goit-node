const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const contactRouter = require("./contacts/contact.router");
const authRouter = require("./users/auth/auth.router");
const usersRouter = require("./users/user.router");
const connectionOnDB = require("./connectionOnDB");

require("dotenv").config();

const { PORT } = process.env;

module.exports = class PhonebookServer {
  constructor() {
    this.server = null;
  }

  start() {
    this.initServer();
    this.initLogger();
    this.initMiddlewares();
    this.initRoutes();
    this.initReturnsStaticFiles();
    this.initDB();
    return this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initLogger() {
    this.server.use(morgan("dev"));
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors({ origin: `http://localhost:${PORT}` }));
  }

  initRoutes() {
    this.server.use("/contacts", contactRouter);
    this.server.use("/auth", authRouter);
    this.server.use("/users", usersRouter);
  }

  initReturnsStaticFiles() {
    this.server.use(express.static("public"));
  }

  initDB() {
    try {
      connectionOnDB();
    } catch (error) {
      process.exit(1);
    }
  }

  startListening() {
    return this.server.listen(PORT, () => {
      console.log("\x1b[36m%s\x1b[0m", `Server started listening on port ${PORT}`);
    });
  }
};
