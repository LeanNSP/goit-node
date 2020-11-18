const { Router } = require("express");

const AuthController = require("./auth/auth.controller");
const UserController = require("./user.controller");
const { uploadMulter } = require("../helpers");

const usersRouter = Router();

usersRouter.get("/current", AuthController.authorize, UserController.getCurrentUser);

usersRouter.get("/", UserController.getFilteredBySubscription);

usersRouter.patch(
  "/avatars",
  AuthController.authorize,
  uploadMulter.upload.single("avatar"),
  UserController.minifyImage,
  UserController.updateAvatar,
);

usersRouter.patch(
  "/",
  AuthController.authorize,
  UserController.validateSubscription,
  UserController.validateSubscriptionEnum,
  UserController.updSubscription,
);

module.exports = usersRouter;
