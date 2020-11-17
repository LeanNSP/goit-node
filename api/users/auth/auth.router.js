const { Router } = require("express");

//------------
const multer = require("multer");
const path = require("path");
//------------
const { createAvatar, clearTempDir } = require("../user.utils");
//------------
const { promises: fsPromises } = require("fs");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
require("dotenv").config();
//------------

const AuthController = require("./auth.controller");

const authRouter = Router();

//--------
const storage = multer.diskStorage({
  destination: "tmp",
  filename: function (req, file, cb) {
    const ext = path.parse(file.originalname).ext;
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});
const upload = multer({ storage });
//--------
async function defaultAvatar(req, res, next) {
  try {
    const { email } = req.body;
    if (!req.file) {
      const avatar = await createAvatar(email);

      req.file = { ...avatar };
    }
    next();
  } catch (error) {
    next(error);
  }
}
//--------
async function minifyImage(req, res, next) {
  try {
    if (req.file) {
      const { filename } = req.file;

      await imagemin([`tmp/${filename}`], {
        destination: `public/${process.env.AVATAR_DIR}`,
        plugins: [
          imageminJpegtran(),
          imageminPngquant({
            quality: [0.6, 0.8],
          }),
        ],
      });

      await clearTempDir(req);

      req.file = {
        ...req.file,
        path: `/${process.env.AVATAR_DIR}/${filename}`,
        destination: `public/${process.env.AVATAR_DIR}`,
      };
    }

    next();
  } catch (error) {
    next(error);
  }
}
//---------

authRouter.post(
  "/register",
  upload.single("avatar"),
  AuthController.validateEmailAndPassword,
  AuthController.validateUniqueEmail,
  defaultAvatar,
  minifyImage,
  (req, res, next) => {
    console.log("req.file", req.file);
    console.log("req.body", req.body);
    next();
  },
  AuthController.registerUser,
);

authRouter.post("/login", AuthController.validateEmailAndPassword, AuthController.loginUser);

authRouter.post("/logout", AuthController.authorize, AuthController.logoutUser);

module.exports = authRouter;
