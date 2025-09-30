const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenCache = require('../utils/tokenStore');
const membershipModel = require('../models/membership.model');

// User registration controller
const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Assign free membership
    const freeMembership = await membershipModel.findOne({ type: 'free', assignedTo: null });
    if (!freeMembership) {
      return res.status(500).json({ message: 'Free membership template not found' });
    }

    // Create a new membership instance for this user
    const membership = new membershipModel({
      type: freeMembership.type,
      totalTime: freeMembership.totalTime,
      totalCoins: freeMembership.totalCoins,
      assignedTo: user._id,
    });

    await membership.save();

    // Link membership to user
    user.membership = membership._id;
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Store token in server memory
    tokenCache.set(token, true);

    res.json({ token, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// User login controller
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Store token in server memory
    tokenCache.set(token, true);

    res.json({ token, message: 'Logged in successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createUser,
  loginUser,
};
