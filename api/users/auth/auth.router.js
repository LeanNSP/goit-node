const { Router } = require("express");

const AuthController = require("./auth.controller");
const UserController = require("../user.controller");

const authRouter = Router();

authRouter.post(
  "/register",
  UserController.upload.single("avatar"),
  AuthController.validateEmailAndPassword,
  AuthController.validateUniqueEmail,
  AuthController.defaultAvatar,
  UserController.minifyImage,
  AuthController.registerUser,
);

authRouter.post("/login", AuthController.validateEmailAndPassword, AuthController.loginUser);

authRouter.post("/logout", AuthController.authorize, AuthController.logoutUser);

module.exports = authRouter;
