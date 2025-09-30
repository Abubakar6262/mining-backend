const membershipModel = require("../models/membership.model");
const userModel = require("../models/user.model");

// Store active sessions in memory (per user)
const activeSessions = {};

// Create Membership (Admin Only)
const createMembership = async (req, res) => {
  try {
    const { type, totalTime, totalCoins } = req.body;

    // Validate membership type
    if (!type || !['free', 'paid'].includes(type)) {
      return res.status(400).json({ message: 'Type must be "free" or "paid"' });
    }

    // Create new membership template
    const membership = new membershipModel({
      type,
      totalTime,
      totalCoins,
    });

    await membership.save();

    res.json({ message: 'Membership created successfully', membership });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Start Mining
const mineStart = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).populate('membership');
    const membership = user.membership;

    if (!membership) {
      return res.status(400).json({ message: 'No membership assigned' });
    }

    if (activeSessions[user._id]) {
      return res.status(400).json({ message: 'Mining already active' });
    }

    // Create session
    const session = {
      coinsMined: 0,
      startTime: Date.now(),
      endTime: Date.now() + membership.totalTime * 3600 * 1000, // Convert hours → ms
      interval: null, // Will hold setInterval reference
    };

    // Increment coins periodically (e.g., 0.01 coin per second)
    session.interval = setInterval(() => {
      if (session.coinsMined < membership.totalCoins) {
        session.coinsMined += 0.01;
      } else {
        // Stop interval if max coins reached
        clearInterval(session.interval);
      }
    }, 1000);

    // Auto-end session after totalTime
    setTimeout(() => {
      clearInterval(session.interval); // stop coins increment
      delete activeSessions[user._id]; // remove session
    }, membership.totalTime * 3600 * 1000);

    activeSessions[user._id] = session;

    res.json({
      message: 'Mining started',
      session: {
        coinsMined: session.coinsMined,
        endTime: session.endTime,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mining Progress
const mineProgress = async (req, res) => {
  try {
    const session = activeSessions[req.user.id];

    if (!session) {
      return res.status(400).json({ message: 'No active mining session' });
    }

    res.json({
      coinsMined: session.coinsMined,
      endTime: session.endTime,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { 
  createMembership, 
  mineStart, 
  mineProgress 
};
