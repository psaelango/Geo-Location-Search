const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const jwt = require("jsonwebtoken");
const { app } = require("../index"); // assuming your app is exported from index.js
const Location = require("../models/location.model");
const User = require("../models/user.model");
const locationMockData = require("../mocks/locationMock.json");

describe("Location Controller", () => {
  let server = app.listen();
  let mongoServer;
  let token;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create a user and generate token
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "testpassword",
    };
    await User.create(userData);
    token = jwt.sign({ email: userData.email }, process.env.JWT_SECRET);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    await server.close();
  });

  afterEach(async () => {
    await Location.deleteMany({});
  });

  describe("getAllLocations", () => {
    it("should get all locations", async () => {
      await Location.create(locationMockData);

      const response = await request(app)
        .get("/api/locations/all")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.locations).toHaveLength(locationMockData.length);
    });
  });

  describe("getPaginatedLocations", () => {
    it("should get paginated locations", async () => {
      await Location.create(locationMockData);

      const response = await request(app)
        .get("/api/locations")
        .set("Authorization", `Bearer ${token}`)
        .query({ page: 1, pageSize: 10 })
        .expect(200);

      expect(response.body.locations).toHaveLength(10);
    });
  });

  describe("searchLocations", () => {
    it("should search locations by query", async () => {
      await Location.create(locationMockData);

      const response = await request(app)
        .get("/api/locations/search")
        .set("Authorization", `Bearer ${token}`)
        .query({ q: "Christmas", latitude: 1, longitude: 1 })
        .expect(200);

      expect(response.body.suggestions).toHaveLength(2);
    });

    it("should return near by locations for empty query", async () => {
      await Location.create(locationMockData);

      const response = await request(app)
        .get("/api/locations/search")
        .set("Authorization", `Bearer ${token}`)
        .query({ q: "", latitude: 16.13, longitude: 165.85 })
        .expect(200);

      expect(response.body.suggestions).toHaveLength(3);
    });

    it("should return empty array if no locations found", async () => {
      const response = await request(app)
        .get("/api/locations/search")
        .set("Authorization", `Bearer ${token}`)
        .query({ q: "Nonexistent City", latitude: 1, longitude: 1 })
        .expect(200);

      expect(response.body.suggestions).toHaveLength(0);
    });
  });
});
