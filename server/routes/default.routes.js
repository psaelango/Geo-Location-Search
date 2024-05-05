const express = require("express");
const router = express.Router();

router.get("/", (req, res) =>
  res
    .status(201)
    .json(
      "Welcome to GeoLocation Search API. Refer Documentation for more deatils.",
    ),
);

module.exports = router;
