const { Router } = require("express");

const AuthController = require("./auth/auth.controller");
const UserController = require("./user.controller");
const { uploadMulter } = require("../helpers");

const usersRouter = Router();

usersRouter.get("/current", AuthController.authorize, UserController.getCurrentUser);

usersRouter.get(
  "/",
  UserController.validateQuerySub,
  UserController.validateQueryBySubscriptionsEnum,
  UserController.getUsersBySubscription,
);

usersRouter.patch(
  "/avatars",
  AuthController.authorize,
  uploadMulter.upload.single("avatar"),
  UserController.updateAvatar,
);

usersRouter.patch(
  "/",
  AuthController.authorize,
  UserController.validateBodySubscription,
  UserController.validateBodyBySubscriptionsEnum,
  UserController.updSubscription,
);

module.exports = usersRouter;
