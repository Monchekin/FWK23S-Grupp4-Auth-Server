const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth_routes');
const cors = require('cors'); 
const helmet = require ('helmet');
const cookieParser = require('cookie-parser');


const app = express();

app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })); 
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use(cookieParser());;



module.exports = app;
