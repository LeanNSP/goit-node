const Avatar = require("avatar-builder");
const { promises: fsPromises } = require("fs");
const pathPack = require("path");

// https://www.npmjs.com/package/avatar-builder
const avatar = Avatar.male8bitBuilder(128);

module.exports = async function createAvatar(email) {
  try {
    const buffer = await avatar.create(email);
    const filename = `avatar-builder-${Date.now()}.png`;
    const path = pathPack.join("tmp", filename);

    await fsPromises.writeFile(path, buffer);

    return { filename, path };
  } catch (error) {
    throw error;
  }
};
