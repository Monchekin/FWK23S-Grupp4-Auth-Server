const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');
const env = require('dotenv');
env.config();

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || 'yourFallbackSecretKey';

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

const userFilePath = path.join(__dirname, 'user.json');
const userData = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));

//Login endpoint..
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = userData.users.find((users) => users.username === username);

    if (user) {
      console.log('User found:', user);
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = jwt.sign(
          {
            username: user.username,
            role: user.role
          },
          SECRET_KEY || 'yourFallbackSecretKey',
          { expiresIn: '24h' }
        );

        res.cookie('jwt', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          maxAge: 86400000
        });

        console.log('TOKEN GENERERAD:', token);

        res.json({ token });
      } else {
        console.log('Wrong password for user:', username);
        res.status(401).json({ error: 'Ogiltigt lösenord för användaren' });
      }
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
