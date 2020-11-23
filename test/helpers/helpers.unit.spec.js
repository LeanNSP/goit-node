const { checkUserByToken, noEmptyObject } = require("../../api/helpers");

describe("Unit test helpers", () => {
  describe("#checkUserByToken", () => {
    let user;
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYjhmYzI0MTI2ZTE2NGRiNDZiMmFmNyIsImlhdCI6MTYwNTk1ODc5OCwiZXhwIjoxNjA2MTMxNTk4fQ.PEwMxU-pbpzv3gsCwG4KGoeCyNZoE286_JdEzvebiAY";

    it("should return an exception if the user does not exist", () => {
      should.throws(() => checkUserByToken(user, token));
    });

    it("should return exception if user.token is not equal to token", () => {
      user = {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      };

      should.throws(() => checkUserByToken(user, token));
    });

    it("returns nothing and there is no exception if user exists and user.token is equal to token", () => {
      user = {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYjhmYzI0MTI2ZTE2NGRiNDZiMmFmNyIsImlhdCI6MTYwNTk1ODc5OCwiZXhwIjoxNjA2MTMxNTk4fQ.PEwMxU-pbpzv3gsCwG4KGoeCyNZoE286_JdEzvebiAY",
      };

      should.doesNotThrow(() => checkUserByToken(user, token), Error);
    });
  });

  describe("#noEmptyObject", () => {
    it("should return expected result for non-empty object", () => {
      const result = noEmptyObject({ a: 1, b: 2, c: 3 });

      result.should.be.above(0).which.is.a.Number();
    });

    it("should return expected result for empty object", () => {
      const result = noEmptyObject({});

      result.should.be.eql(0).which.is.a.Number();
    });
  });
});
