const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const env = require('dotenv');
env.config();

router.user(cookieParser());
const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'yourFallbackSecretKey';

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});


const userDataPath = `${__dirname}/../user.json`;
const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf-8'));

// Login endpoint där vi ska hantera login post-request och ge ett JWT Token?
// Hashning av password? där vi ska använda oss av bcrypts ramverk för att hasha och stora dom i vår jsonfil,

//Registreringsendpoint för att skapa nya användare 
router.post('/register', async (req, res) => {
  const { username, password, email, role } = req.body;
  let userData = loadUserData();

//Kolla om användaren redan finns 
if (userData.users.some(user => user.username === username)) {
  return res.status(409).json({ message: 'Användaren finns redan.' });
}

// Hasha lösenordet innan man sparar användaren
try {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = {
    id: userData.users.length + 1, 
    username,
    password: hashedPassword,
    email,
    role
  };

// Lägg till den nya användaren och spara tillbaka till filen
userData.users.push(newUser);
    fs.writeFileSync(userDataPath, JSON.stringify(userData), 'utf-8');
    res.status(201).json({ message: 'Användaren skapad.' });
  } catch (error) {
    res.status(500).json({ message: 'Ett fel inträffade vid registrering.', error });
  }
});

//inloggningsendpoint för att autentisera användare
router.post('/login', async (req, res) => {
  const  { username, password } = req.body;
  const userData = loadUserData(); 

  
const user = userData.users.find((users) => users.username === username);

// jämföra det inskickade lösenordet med det hashade lösenordet   
if (user && await bcrypt.compare(password, user.password)) {

//Om Password och user är korrekt ska vi sätta utfärda ett JWT Token, med en expireDate på 1h, annars skickar vi felkod 401. att loggin blev fel!
//Generera en JWT Token med Payload info...
    const token = jwt.sign(
      {
        username: user.username,
        role: user.role
      },
      SECRET_KEY || 'yourFallbackSecretKey',
      { expiresIn: '1h' }
    );

    res.cookie('jwt', token,
      {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 3600000
      }
    );

    console.log('Token genererat:', token);

    res.json({ token });
  } else {
    console.log('Inloggning misslyckades!', username, password);
    res.status(401).json({ error: 'Ogiltig inloggning' });
  }
});

/* router.get('/data', authCheckToken, (req, res) => {
  res.json(req.user);
}); */

module.exports = router;
