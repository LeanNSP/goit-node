const { Router } = require("express");

const AuthController = require("./auth/auth.controller");
const UserController = require("./user.controller");

const usersRouter = Router();

usersRouter.get("/current", AuthController.authorize, UserController.getCurrentUser);

usersRouter.get("/", UserController.getFilteredBySubscription);

usersRouter.patch(
  "/avatars",
  AuthController.authorize,
  UserController.upload.single("avatar"),
  UserController.minifyImage,
  (req, res, next) => {
    console.log("req.user", req.user);
    console.log("req.file", req.file);
    console.log("req.body", req.body);
    next();
  },
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
