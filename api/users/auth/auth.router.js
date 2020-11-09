const { Router } = require('express');

const AuthController = require('./auth.controller');

const authRouter = Router();

authRouter.post(
  '/register',
  AuthController.validateEmailAndPassword,
  AuthController.validateUniqueEmail,
  AuthController.registerUser,
);

authRouter.post('/login', AuthController.validateEmailAndPassword, AuthController.loginUser);

module.exports = authRouter;
