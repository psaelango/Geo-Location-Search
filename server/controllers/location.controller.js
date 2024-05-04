const asyncHandler = require('express-async-handler');
const logger = require('../utils/logger');
const Location = require('../models/location.model');

// @desc    Get all locations
// @route   GET /api/location/all
// @access  Public
const getAllLocations = asyncHandler(async (req, res) => {
  try {
		const locations = await Location.find();
		res.json({ locations: locations });
	} catch (error) {
		logger.log('error', 'Location Controller getAllLocations error: ', new Error(error));
		res.status(500).json({ message: 'Internal Server Error' });
	}
});

module.exports = {
	getAllLocations
}