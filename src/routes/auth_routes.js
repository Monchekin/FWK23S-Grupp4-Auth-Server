const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const bcrypt = require('bcrypt');

const router = express.Router();
const secretKey = 'your_secret_key'; // Ersätt denna key med en stark och säker nyckel senare!!!

//Ladda user data från user.json filen där vi sparar all mockdata om users
const userData = JSON.parse(fs.readFileSync('users.json', 'utf-8'));


//Om vi ska ha registration så ska det ligga här!



router.post('/login', (req, res) => {
    //Condition för att kolla om user är valid med email och password, JWT Token sign, vi ska ge session id och tid för token expiration
    //annars om inte valid user skicka felkod 401. 
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
