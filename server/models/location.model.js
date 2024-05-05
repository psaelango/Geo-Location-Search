const mongoose = require('mongoose');

const pointCoordinateSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const LocationSchema = new mongoose.Schema({
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
  location: {
    type: pointCoordinateSchema,
    required : true,
  }
});

// LocationSchema.virtual('location')
// .get(function () {
//   return {
//       type: 'Point',
//       coordinates: [this.longitude, this.latitude]
//   };
// })
// .set('toJSON', { getters: true });

LocationSchema.index({ "location": "2dsphere" });

module.exports = mongoose.model('Geolocation', LocationSchema, 'geolocation');
