const express = require('express');
const router = express.Router();
const {
  getAllLocations
} = require('../controllers/location.controller');

router.get('/all', getAllLocations)

module.exports = router
