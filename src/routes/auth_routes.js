const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const env = require('dotenv');
env.config();

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'yourFallbackSecretKey';

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

const userDataPath = `${__dirname}/../user.json`;
const userData = JSON.parse(fs.readFileSync(userDataPath, 'utf-8'));

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = userData.users.find((users) => users.username === username);

  if (user) {
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
