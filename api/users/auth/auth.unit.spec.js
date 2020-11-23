const sinon = require("sinon");
const should = require("should");

const AuthService = require("./auth.service");
const UserModel = require("../user.model");
// const { getUserIdWithToken } = require("../../helpers");
const helpers = require("../../helpers");

describe("Unit test auth.service", () => {
  describe("#autorize", () => {
    let sandbox;
    let getUserIdWithTokenStub;
    let findByIdStub;
    let checkUserByTokenStub;
    let actualResult;

    const authorizationHeader =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYjhmYzI0MTI2ZTE2NGRiNDZiMmFmNyIsImlhdCI6MTYwNTk1ODc5OCwiZXhwIjoxNjA2MTMxNTk4fQ.PEwMxU-pbpzv3gsCwG4KGoeCyNZoE286_JdEzvebiAY";

    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYjhmYzI0MTI2ZTE2NGRiNDZiMmFmNyIsImlhdCI6MTYwNTk1ODc5OCwiZXhwIjoxNjA2MTMxNTk4fQ.PEwMxU-pbpzv3gsCwG4KGoeCyNZoE286_JdEzvebiAY";

    before(async () => {
      sandbox = sinon.createSandbox();
      getUserIdWithTokenStub = sandbox.stub(helpers, "getUserIdWithToken");
      findByIdStub = sandbox.stub(UserModel, "findById");
      checkUserByTokenStub = sandbox.stub(helpers, "checkUserByToken");

      // console.log(helpers);

      try {
        getUserIdWithTokenStub(token);
        await AuthService.autorize(authorizationHeader);
      } catch (error) {
        actualResult = error;
      }
    });

    after(() => {
      sandbox.restore();
    });

    it("should call getUserIdWithToken", () => {
      console.log("ok");
      sinon.assert.called(getUserIdWithTokenStub);
      sinon.assert.calledWithExactly(getUserIdWithTokenStub, token);
    });
  });
});
