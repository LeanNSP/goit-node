const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");

require("dotenv").config();
const { AVATAR_DIR } = process.env;

module.exports = async function minimizeImage(filename) {
  try {
    await imagemin([`tmp/${filename}`], {
      destination: `public/${AVATAR_DIR}`,
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    });
  } catch (error) {
    throw error;
  }
};
