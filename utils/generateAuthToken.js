const jwt = require('jsonwebtoken');
require('dotenv').config();
const generateAuthToken = (user) => {
    const payload = {
        username: user.username,
        email: user.email
    };
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    return token;
};