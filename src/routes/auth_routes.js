const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const bcrypt = require('bcrypt');
const env = require('dotenv');

const router = express.Router();
env.config();
const secretKey = process.env.SECRET_KEY || 'default_secret_key'; // Ersätt denna key med en stark och säker nyckel senare!!!



//Ladda user data från user.json filen där vi sparar all mockdata om users
const userDataPath = `${__dirname}/../user.json`;
const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf-8'));


//Om vi ska ha registration så ska det ligga här!


// Login endpoint där vi ska hantera login requesten och ge ett JWT Token?
// Hashning av password? där vi ska använda oss av bcrypts ramverk för att hasha och stora dom i vår jsonfil,
router.post('/login', (req, res) => {
    const  { username, password } = req.body;

    // gå in i userData jsonfil, och kolla users, username, condition för att kolla om password är korrekt utfärda token, annars felkod 401.
    const user = userData.users.find((u) => u.username === username);

      if( user && bcrypt.compareSync(password, user.password)) {
        //Om Password och user är korrekt ska vi sätta utfärda ett JWT Token, med en expireDate på 1h, annars skickar vi felkod 401. att loggin blev fel!
        const token = jwt.sign({ userId: user.userId, username: user.username }, secretKey, { expiresIn: '1h' });
        res.json({ token });
        console.log(token)
      } else {
        res.status(401).json({ error: 'Invalid Login'})
      }
});

//MiddleWare function för att authentisera sig med JWT Token
function authCheckToken(req, res, next) {
  const authHeader = req.headers.split('')[1];

  //condition om inget token skicka felmeddelande
  if(!token) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }
 //Verifiera jwt token + secret key skicka annars error om token inte är valid. 
  jwt.verify(token, secretKey, (err, user) => {
    if(err) {
      return res.status(403).json({ message: 'Token is not valid!'});
    }
    req.user = user;
    next();
  });
}

// Verifiera Token endpoint
router.get('/verify', authCheckToken, (req, res) => {
  res.json(req.user);
});

/* router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (isValidUser(email, password)) {
    const token = jwt.sign({ email, role: getUserRole(email) }, 'secretKey', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid login' });
  }
});

const isValidUser = (email, password) => {
  return email === 'user@example.com' && password === 'password';
};

const getUserRole = (email) => {
  return email === 'admin@example.com' ? 'admin' : 'user';
}; */

module.exports = router;
