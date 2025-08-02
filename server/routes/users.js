const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

// @route   POST api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if a user with that email already exists in the database
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 2. If not, create a new user instance with the provided data
    user = new User({ name, email, password });

    // 3. Hash the password for security before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 4. Save the new user document to MongoDB
    await user.save();

    // 5. Create a JSON Web Token (JWT) for authentication
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Your secret key from the .env file
      { expiresIn: 3600 }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Send the token back to the frontend
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/users/login
// @desc    Authenticate user & get token (Login)
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find the user in the database by their email
        let user = await User.findOne({ email });
        if (!user) {
            // If no user is found, send an error
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 2. Compare the password from the form with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // If passwords don't match, send an error
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // 3. If credentials are correct, create and return a new JWT
        const payload = { user: { id: user.id } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token }); // Send the token back to the frontend
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
