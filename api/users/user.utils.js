function nonSecretUserInfo({ email, subscription }) {
  return { email, subscription };
}

module.exports = {
  nonSecretUserInfo,
};
