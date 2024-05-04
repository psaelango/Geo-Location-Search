const mongoose = require('mongoose');

const Location = new mongoose.Schema({
  street: {
    type: String,
    required : true,
  },
  city: {
    type: String,
    required : true,
  },
  zip_code: {
    type: String,
    required : true,
  },
  county: {
    type: String,
    required : true,
  },
  country: {
    type: String,
    required : true,
  },
  time_zone: {
    type: String,
    required : true,
  },
  latitude: {
    type: Number,
    required : true,
  },
  longitude: {
    type: Number,
    required : true,
  },
});

module.exports = mongoose.model('Geolocation', Location, 'geolocation');
