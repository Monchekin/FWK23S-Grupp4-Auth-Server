const jwt = require('jsonwebtoken');
const env = require('dotenv');
const cookieParser = require('cookie-parser');
env.config();

const SECRET_KEY = process.env.SECRET_KEY || 'yourFallbackSecretKey';

// Cookie parse middleware authentisering som vi använder separat och kan specificera sig vart vart vi vill authentisera mot.
function authCheckToken(req, res, next) {
    //om ingen token eller cookie finns skicka annars felkod 401
    const jwtCookie = req.cookies.jwt;

    console.log('Request Cookies:', jwtCookie);
    cookieParser()(req, res, function(err) {
        if (err) {
            console.error('Error parsing cookies:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]

          if (!token && !jwtCookie) {
            console.log('No token found. Allowing access without authentication.');
            return next()
        }

        // Om det finns en token så verifiera den.
        jwt.verify(jwtCookie || token, SECRET_KEY, (err, user) => {
            if (err) {
                console.error('JWT Verification Error:', err);
                return res.status(403).json({ message: 'Token is not valid!', error: err.message });
            }
            req.user = user;
            next();
        });
    });
}
module.exports = authCheckToken;