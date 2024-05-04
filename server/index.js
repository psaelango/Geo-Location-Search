require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errorHandler } = require('./middleware/error.middleware');

const port = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use('/api', require('./routes/default.routes'));
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
