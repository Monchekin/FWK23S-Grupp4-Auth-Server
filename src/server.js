const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth_routes');
const cors = require('cors'); 
const helmet = require ('helmet');

const app = express();

app.use(helmet());
app.use(cors()); 
app.use(bodyParser.json());
app.use('/auth', authRoutes);

module.exports = app;
