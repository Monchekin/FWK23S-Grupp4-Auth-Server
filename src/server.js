const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth_routes');
const cors = require('cors'); 
const cookieParser = require('cookie-parser');
const authCheckToken = require('./routes/authMiddleware');

//mot olika attacker:
const helmet = require ('helmet');
const frameguard = require('frameguard');
const csp = require('helmet-csp');
const noSniff = require ('dont-sniff-mimetype');
const referrerPolicy = require ('referrer-policy');

const app = express();
app.use(authCheckToken);

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
})); 

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use(cookieParser());;

// Använder helmet middleware med/som standardinställningar
app.use(helmet());

// Mot Clickjacking
app.use(frameguard({ action: 'deny' })); // 'DENY' betyder att webbläsaren inte tillåter att sidan inramas av någon annan sida.

// Mot XSS-attacker
app.use(helmet.xssFilter());

// Mot MIME-sniffing
app.use(noSniff());

// Mot Referrer Leakage
app.use(referrerPolicy({ policy: 'same-origin', policy: 'strict-origin-when-cross-origin' }));

// Anpassa CSP (Content Security Policy)
app.use(
  csp({
    directives: {
      defaultSrc: ["'self'"],   // Tillåts bara laddning från samma domän och protokoll som sidan själv har.
      scriptSrc: ["'self'"],    // Förhindrar att externa skript körs på sidan.
      objectSrc: ["'none'"],    // Här förbjuds alla objekt från att laddas ex. Flash, Java-applet
    },
  })
);

module.exports = app;


