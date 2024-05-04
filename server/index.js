require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const logger = require('./utils/logger');
const { errorHandler } = require('./middleware/error.middleware');

const port = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use(bodyParser.json());

const connectDB = require('./config/db');
connectDB();

app.use('/api', require('./routes/default.routes'));
app.use('/api/location', require('./routes/location.routes'));

app.use(errorHandler);

app.listen(port, () => logger.info(`Server running on port ${port}`));
