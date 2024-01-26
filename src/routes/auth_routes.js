const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cookieParser = require('cookie-parser');
//const bcrypt = require('bcrypt');
const env = require('dotenv');
env.config();

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'yourFallbackSecretKey';

//Ladda user data från user.json filen där vi sparar all mockdata om users
const userDataPath = `${__dirname}/../user.json`;
const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf-8'));

// Login endpoint där vi ska hantera login post-request och ge ett JWT Token?
// Hashning av password? där vi ska använda oss av bcrypts ramverk för att hasha och stora dom i vår jsonfil,
router.post('/login', (req, res) => {
    const  { username, password } = req.body;
    
    // gå in i userData jsonfil, och kolla users, username, condition för att kolla om password är korrekt utfärda token, annars felkod 401.
    const user = userData.users.find((users) => users.username === username);
    
    //Kommenterar bort kod för att jämföra user hashning av lösenord vi får lägga till denna senare,
    //just nu tittar den i user.json filen om username och lösenord existerar och stämmer överens så generera token och logga in,  
    /* if( user && bcrypt.compareSync(password, user.password)) */
      if(user) {
        //Om Password och user är korrekt ska vi sätta utfärda ett JWT Token, med en expireDate på 1h, annars skickar vi felkod 401. att loggin blev fel!
        
        //Generera en JWT Token med Payload info...
        const token = jwt.sign(
          { 
            username: user.username,
            role: user.role },
            SECRET_KEY || 'yourFallbackSecretKey',
          { expiresIn: '24h' });
            // Sätta token i en HTTP-only Cookie..
              res.cookie('jwt', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 3600000}); // MaxAge är i millisekunder, (1 timme nu.)
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

  //Kolla om det finns jwt cookie
  const jwtCookie = req.cookies.jwt;
 
  //condition om inget token skicka felmeddelande
     if(!token && !jwtCookie) {
    return res.status(401).json({ message: 'Unauthorized!' });
  }
 //Verifiera jwt token + secret key skicka annars error om token inte är valid. 
   jwt.verify(jwtCookie || token, SECRET_KEY, (err, user) => {
    if(err) {
      console.error('JWT Verification Error:', err);
      return res.status(403).json({ message: 'Token is not valid!', error: err.message});
    }
    req.user = user;
    next();
  });
}

// Verifiera Token endpoint
  router.get('/data', authCheckToken, (req, res) => {
  res.json(req.user);
});

module.exports = router;
