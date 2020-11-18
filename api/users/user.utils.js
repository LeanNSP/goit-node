const Avatar = require("avatar-builder");
const { promises: fsPromises } = require("fs");
const pathPack = require("path");

const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");

// https://www.npmjs.com/package/avatar-builder
const avatar = Avatar.male8bitBuilder(128);

async function createAvatar(email) {
  try {
    const buffer = await avatar.create(email);
    const filename = `avatar-builder-${Date.now()}.png`;
    const path = pathPack.join("tmp", filename);

    await fsPromises.writeFile(path, buffer);

    return { filename, path };
  } catch (error) {
    throw error;
  }
}

async function clearTempDir(req) {
  try {
    if (req.file) {
      await fsPromises.unlink(req.file.path);
    }
  } catch (error) {
    throw error;
  }
}

function nonSecretUserInfo({ email, subscription }) {
  return { email, subscription };
}

async function onImagemin(filename) {
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
}

module.exports = {
  nonSecretUserInfo,
  createAvatar,
  clearTempDir,
  onImagemin,
};
