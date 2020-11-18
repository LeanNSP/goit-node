const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");

module.exports = async function minimizeImage(filename) {
  try {
    await imagemin([`tmp/${filename}`], {
      destination: `public/${process.env.AVATAR_DIR}`,
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
