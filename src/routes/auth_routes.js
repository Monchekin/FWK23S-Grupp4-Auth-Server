const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const bcrypt = require('bcrypt');
const env = require('dotenv');

const router = express.Router();
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

    //Kommenterar bort kod för att jämföra user hashning av lösenord vi får lägga till denna senare,
    //just nu tittar den i user.json filen om username och lösenord existerar och stämmer överens så generera token och logga in,
      /* if( user && bcrypt.compareSync(password, user.password)) */
      if(user) {
        //Om Password och user är korrekt ska vi sätta utfärda ett JWT Token, med en expireDate på 1h, annars skickar vi felkod 401. att loggin blev fel!
        const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, 'secretKey', { expiresIn: '1h' });
        console.log('Token Genererad:', token)
        res.json({ token });
      } else {
        console.log('Login Failed!', username, password)
        res.status(401).json({ error: 'Invalid Login'})
      }
});

//MiddleWare function för att authentisera sig med JWT Token
function authCheckToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Received token for verification:', token);

  //condition om inget token skicka felmeddelande
  if(!token) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }
 //Verifiera jwt token + secret key skicka annars error om token inte är valid. 
  jwt.verify(token, secretKey, (err, user) => {
    if(err) {
      console.error('JWT Verification Error:', err);
      return res.status(403).json({ message: 'Token is not valid!', error: err.message});
    }
    req.user = user;
    next();
  });
}

// Verifiera Token endpoint
router.get('/verify', authCheckToken, (req, res) => {
  console.log('Received request for /secret-data:', req.user);
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
