const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth_routes');
const cors = require('cors'); 

const app = express();

app.use(cors());  // Use CORS middleware without any restrictions
app.use(bodyParser.json());
app.use('/auth', authRoutes);

module.exports = app;
