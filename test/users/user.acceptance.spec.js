const request = require("supertest");
const jwt = require("jsonwebtoken");
const path = require("path");

const PhonebookServer = require("../../api/server");
const userModel = require("../../api/users/user.model");

describe("Acceptance test user.router", () => {
  let server;
  let token;
  let authorizationHeader;
  let userTest;

  before(() => {
    server = new PhonebookServer().start();
  });

  after(() => {
    server.close(() => {
      process.exit(0);
    });
    console.log("\x1b[31m%s\x1b[0m", "Server stopped");
  });

  describe("PATCH /users/avatars", () => {
    it("should return 401 Error: Not authorized", async () => {
      await request(server)
        .patch("/users/avatars")
        .set("Content-Type", "multipart/form-data")
        .set("Authorization", "")
        .send()
        .expect(401);
    });

    context("when user with such token exists", () => {
      before(async () => {
        userTest = await userModel.create({
          email: "test@mail.com",
          passwordHash: "password_hash",
        });
        token = jwt.sign({ id: userTest._id }, process.env.JWT_SECRET);
        await userModel.updToken(userTest._id, token);
        authorizationHeader = `Bearer ${token}`;
      });

      after(async () => {
        await userModel.findByIdAndDelete(userTest._id);
      });

      it("should return 400 invalid data if the avatar is not present in the request", async () => {
        await request(server)
          .patch("/users/avatars")
          .set("Authorization", authorizationHeader)
          .type("form")
          .attach()
          .expect(400);
      });

      it("should return 200 if the avatar is present in the request", async () => {
        const res = await request(server)
          .patch("/users/avatars")
          .set("Authorization", authorizationHeader)
          .type("form")
          .attach("avatar", path.resolve(__dirname, "../images/test_avatar.png"))
          .expect(200);

        const resBody = res.body;
        resBody.should.have.property("avatarURL").which.is.a.String();

        const userWithUpdAvatar = await userModel.findById(userTest._id);
        should(resBody.avatarURL).be.exactly(userWithUpdAvatar.avatarURL);
      });
    });
  });

  describe("GET /users/current", () => {
    it("should return 401 Error: Not authorized", async () => {
      await request(server).get("/users/current").set("Authorization", "").send({}).expect(401);
    });

    context("when user with such token exists", () => {
      before(async () => {
        userTest = await userModel.create({
          email: "test@mail.com",
          passwordHash: "password_hash",
        });
        token = jwt.sign({ id: userTest._id }, process.env.JWT_SECRET);
        await userModel.updToken(userTest._id, token);
        authorizationHeader = `Bearer ${token}`;
      });

      after(async () => {
        await userModel.findByIdAndDelete(userTest._id);
      });

      it("should return 200 authorized", async () => {
        await request(server)
          .get("/users/current")
          .set("Authorization", authorizationHeader)
          .send({})
          .expect(200);
      });
    });
  });
});
