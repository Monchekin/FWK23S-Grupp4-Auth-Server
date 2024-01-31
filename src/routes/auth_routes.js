const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const env = require('dotenv');
const path = require('path');
env.config();

const router = express.Router();
router.use(cookieParser())
const SECRET_KEY = process.env.SECRET_KEY || 'yourFallbackSecretKey';

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

const userFilePath = path.join(__dirname, '../../../user.json');
//const userData = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));

function loadUserData() {
  return JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));
}

// Registrerings-endpoint för att skapa nya användare 
router.post('/register', async (req, res) => {
  const { username, password, email, role } = req.body;
  let userData = loadUserData();

// Kolla om användaren redan finns 
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
    email: `${username}@example.com`,
    role: 'user',
  };

// Lägg till den nya användaren och spara tillbaka till filen
userData.users.push(newUser);
    fs.writeFileSync(userFilePath, JSON.stringify(userData), 'utf-8');
    res.status(201).json({ message: 'Användaren skapad.' });
  } catch (error) {
    res.status(500).json({ message: 'Ett fel inträffade vid registrering.', error });
  }
});

// Inloggnings-endpoint för att autentisera användare
router.post('/login', async (req, res) => {
  const  { username, password } = req.body;
  const userData = loadUserData(); 
const user = userData.users.find((users) => users.username === username);

// Jämföra det inskickade lösenordet med det hashade lösenordet   
if (user && await bcrypt.compare(password, user.password)) {

// Generera en JWT Token med Payload info...
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
      httpOnly: true, //Förhindrar att JavaScript har åtkomst till cookies
      secure: true,  //Kräver en säker anslutning (HTTPS) för att skicka cookies
      sameSite: 'strict', //Begränsar när cookien skickas med i en begäran
      maxAge: 3600000  // Sätter en maximal ålder på cookien till 1 timme
    }
  );

  console.log('Token genererat:', token);
  res.json({ token });
  } else {
    console.log('Inloggning misslyckades!', username, password);
    res.status(401).json({ error: 'Ogiltig inloggning' });
  }
});

module.exports = router;
