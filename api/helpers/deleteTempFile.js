const { promises: fsPromises } = require("fs");

module.exports = async function deleteTempFile(req) {
  try {
    if (req.file) {
      await fsPromises.unlink(req.file.path);
    }
  } catch (error) {
    throw error;
  }
};
