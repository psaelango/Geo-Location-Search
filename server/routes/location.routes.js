const express = require("express");
const router = express.Router();
const {
  getAllLocations,
  getPaginatedLocations,
  searchLocations,
} = require("../controllers/location.controller");

const { protect } = require("../middleware/auth.middleware");
const { cacheMiddleware } = require("../middleware/customCache.middleware");
// const redisCacheMiddleware = require('../middleware/redisCache.middleware');

router.route("/").get(protect, getPaginatedLocations);
router.route("/all").get(protect, cacheMiddleware, getAllLocations);
router.route("/search").get(protect, searchLocations);

module.exports = router;
