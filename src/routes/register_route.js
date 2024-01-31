const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');

const router = express.Router();

const userFilePath = path.join(__dirname, 'user.json');
const userData = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));

//Register newUser endpoint..
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Generera salt 
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
  
      // Hasha password och använd saltning,
      const hashedPassword = await bcrypt.hash(password, salt);
      
      //Lägger på indexering på numrering i user.json
      const newUserId = userData.users.length + 1;
  
      // lägger till ny data till users i user.json
      const newUser = {
        id: newUserId,
        username,
        password: hashedPassword,
        email: `${username}@example.com`,
        role: 'user',
      };

      //Pushar ny användare till arrayn user.json med ny data
      userData.users.push(newUser);
  
      // Sparar till user.json med ny användardata
      fs.writeFileSync(userFilePath, JSON.stringify(userData, null, 2), 'utf-8');
  
      
      res.json({ message: 'User registered!' });
      console.log('User Successfully Registered to DB')
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;
