const { Router } = require('express');

const AuthController = require('./auth/auth.controller');
const UserController = require('./user.controller');

const usersRouter = Router();

usersRouter.get('/current', AuthController.authorize, UserController.getCurrentUser);

module.exports = usersRouter;
