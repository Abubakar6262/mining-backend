const express = require('express');
const router = express.Router();
const authentication = require('../middleware/authentication');
const authurization = require('../middleware/authurization');
const membershipModel = require('../models/membership.model');
const { mineStart, mineProgress, createMembership } = require('../controllers/mineController');

// Create a new membership (admin only)
router.post('/create', authentication, authurization(['admin']), createMembership);

// Get all memberships (admin only)
router.get('/all', authentication, authurization(['admin']), async (req, res) => {
    try {
        const memberships = await membershipModel.find();
        res.json({ memberships });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start mining
router.post('/start', authentication, mineStart);

// Check mining progress
router.get('/progress', authentication,mineProgress )

module.exports = router;
