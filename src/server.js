const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth_routes');
const cors = require('cors'); 
const cookieParser = require('cookie-parser');

//mot olika attacker:
const helmet = require ('helmet');
const frameguard = require('frameguard');
const csp = require('helmet-csp');
const noSniff = require ('dont-sniff-mimetype');
const referrerPolicy = require ('referrer-policy');
const hidePoweredBy = require('hide-powered-by')

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })); 
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use(cookieParser());;


app.use(helmet());

//mot clickjacking
app.use(frameguard({ action: 'deny' })); //'DENY' betyder att webbläsaren inte tillåter att sidan inramas av någon annan sida.

//mot XSS-attacker
app.use(helmet.xssFilter());
app.use(csp({ 
  directives: { defaultSrc: ["'self'"]}
}));

//mot MIME-sniffing
app.use(noSniff());

//mot Referrer Leakage
app.use (referrerPolicy({policy: 'same-origin'}));

//mot Information Disclosure
app.use(hidePoweredBy());


module.exports = app;

