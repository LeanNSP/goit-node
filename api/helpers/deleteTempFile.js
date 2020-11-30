const { promises: fsPromises } = require("fs");

module.exports = async function deleteTempFile(filePath) {
  try {
    await fsPromises.unlink(filePath);
  } catch (error) {
    throw error;
  }
};
