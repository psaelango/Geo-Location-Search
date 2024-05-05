const asyncHandler = require("express-async-handler");
const logger = require("../utils/logger");
const Location = require("../models/location.model");
const {
  calculateDistance,
  convertRange,
  normalizeScore,
} = require("../utils/location.utils");
const { cache } = require("../middleware/customCache.middleware");
// const { setToCache } = require('../utils/redisCache');

// @desc    Get all locations
// @route   GET /api/locations/all
// @access  Private
const getAllLocations = asyncHandler(async (req, res) => {
  try {
    const locations = await Location.find({});
    cache.set(req.url, locations);
    // await setToCache(req.url, locations);
    res.json({ locations: locations });
  } catch (error) {
    logger.log(
      "error",
      "Location Controller getAllLocations error: ",
      new Error(error),
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc    Get all locations
// @route   GET /api/locations
// @access  Private
const getPaginatedLocations = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const totalLocations = await Location.countDocuments();
    const totalPages = Math.ceil(totalLocations / pageSize);

    const locations = await Location.find({})
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({
      locations,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    logger.log(
      "error",
      "Location Controller getPaginatedLocations error: ",
      new Error(error),
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc    Get location for given query
// @route   GET /api/locations/search
// @access  Private
const searchLocations = asyncHandler(async (req, res) => {
  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  try {
    const { q, latitude, longitude } = req.query;
    const searchRegex = new RegExp(q, "i");
    console.log("searchRegex = ", searchRegex);

    let query = {};
    if (q.trim() === "") {
      query = {
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(longitude), parseFloat(latitude)],
            },
            $maxDistance: 1000000,
          },
        },
      };
    } else {
      query = {
        $or: [
          { street: { $regex: searchRegex } },
          { city: { $regex: searchRegex } },
          { time_zone: { $regex: searchRegex } },
          { county: { $regex: searchRegex } },
          { country: { $regex: searchRegex } },
        ],
      };
    }
    console.log("query = ", JSON.stringify(query));
    const locations = await Location.find(query);
    console.log("locations = ", locations.length);

    const searchResults = locations.map((location) => {
      const distance = calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        location.latitude,
        location.longitude,
      );
      return {
        name: `${location.city}, ${location.country}`,
        latitude: location.latitude,
        longitude: location.longitude,
        score: distance.toFixed(2),
      };
    });

    searchResults.sort((a, b) => a.score - b.score);

    if (searchResults.length > 1) {
      const minDistance = parseInt(searchResults[0].score);
      const maxDistance = parseInt(
        searchResults[searchResults.length - 1].score,
      );
      const minValue = minDistance - minDistance * 0.35;
      const maxValue = maxDistance + maxDistance * 0.15;
      const scoredResults = searchResults.map((result) => {
        const newScore = normalizeScore(
          result.score,
          minValue,
          maxValue,
        ).toFixed(2);
        // const newScore = convertRange(result.score, [minDistance, maxDistance], [0, 1])
        return { ...result, score: newScore };
      });
      res.json({ suggestions: scoredResults });
    } else {
      res.json({ suggestions: searchResults });
    }
  } catch (error) {
    logger.log(
      "error",
      "Location Controller searchLocations error: ",
      new Error(error),
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = {
  getAllLocations,
  getPaginatedLocations,
  searchLocations,
};
