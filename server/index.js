require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const logger = require("./utils/logger");
const { errorHandler } = require("./middleware/error.middleware");

const port = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use(bodyParser.json());

if (process.env.NODE_ENV !== "test") {
  const connectDB = require("./config/db");
  connectDB();
}

app.use("/api", require("./routes/default.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/locations", require("./routes/location.routes"));

app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => logger.info(`Server running on port ${port}`));
}

module.exports = { app };
