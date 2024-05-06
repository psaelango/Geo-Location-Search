const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");

const { app } = require("../index");
const User = require("../models/user.model");

describe("User Controller", () => {
  let server;
  let mongoServer;

  beforeAll(async () => {
    server = app.listen();
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    await server.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("registerUser", () => {
    it("should register a new user", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "testpassword",
      };

      const response = await request(app)
        .post("/api/users")
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty("_id");
      expect(response.body).toHaveProperty("name", userData.name);
      expect(response.body).toHaveProperty("email", userData.email);
      expect(response.body).toHaveProperty("token");
    });

    it("should return an error if fields are missing", async () => {
      const userData = { name: "Test User", email: "test@example.com" }; // missing password

      const response = await request(app)
        .post("/api/users")
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty("message", "Please add all fields");
    });

    it("should return an error if user already exists", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "testpassword",
      };
      await User.create(userData);

      const response = await request(app)
        .post("/api/users")
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty("message", "User already exists");
    });
  });

  describe("loginUser", () => {
    it("should login an existing user", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "testpassword",
      };
      await request(app).post("/api/users").send(userData).expect(201);

      const response = await request(app)
        .post("/api/users/login")
        .send({ email: "test@example.com", password: "testpassword" })
        .expect(200);

      expect(response.body).toHaveProperty("_id");
      expect(response.body).toHaveProperty("name", userData.name);
      expect(response.body).toHaveProperty("email", userData.email);
      expect(response.body).toHaveProperty("token");
    });

    it("should return an error for invalid credentials", async () => {
      const response = await request(app)
        .post("/api/users/login")
        .send({ email: "test@example.com", password: "invalidpassword" })
        .expect(400);

      expect(response.body).toHaveProperty("message", "Invalid credentials");
    });
  });

  describe("getUserInfo", () => {
    it("should get user info with valid token", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "testpassword",
      };
      const user = await User.create(userData);
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      const response = await request(app)
        .get("/api/users/details")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty("_id", user._id.toHexString());
      expect(response.body).toHaveProperty("name", user.name);
      expect(response.body).toHaveProperty("email", user.email);
      expect(response.body).not.toHaveProperty("password");
    });

    it("should return an error for invalid token", async () => {
      const response = await request(app)
        .get("/api/users/details")
        .set("Authorization", "Bearer invalidtoken")
        .expect(401);

      expect(response.body).toHaveProperty("message", "Not authorized");
    });
  });
});
