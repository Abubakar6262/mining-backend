const {Router} = require('express');
const User = require('../models/user.model');
const { createUser, loginUser } = require('../controllers/authController');

const router = Router();

// Test route to verify the auth route is working
router.get('/', (req, res) => {
    res.send('Auth route is working');
});

// User registration route
router.post('/register', createUser );

// User login route
router.post('/login', loginUser );

module.exports = router;
