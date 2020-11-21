const { Router } = require("express");

const AuthController = require("./auth.controller");
const { uploadMulter } = require("../../helpers");

const authRouter = Router();

authRouter.post(
  "/register",
  uploadMulter.upload.single("avatar"),
  AuthController.validateEmailAndPassword,
  AuthController.validateUniqueEmail,
  AuthController.registerUser,
);

authRouter.post("/login", AuthController.validateEmailAndPassword, AuthController.loginUser);

authRouter.post("/logout", AuthController.authorize, AuthController.logoutUser);

module.exports = authRouter;
