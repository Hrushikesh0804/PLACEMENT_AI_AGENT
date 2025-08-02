const express = require('express');
const router = express.Router();

// Import your data models here as you create them
// const Interview = require('../models/Interview');
// const User = require('../models/User');

/**
 * @route   GET /api/test
 * @desc    A sample test route to confirm the server is working.
 * @access  Public
 */
router.get('/test', (req, res) => {
  res.json({ msg: 'Hello from the API! Your server is live.' });
});

// --- Add other routes below ---

// Example route for getting interviews
// router.get('/interviews', async (req, res) => {
//   try {
//     const interviews = await Interview.find();
//     res.json(interviews);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

module.exports = router;
