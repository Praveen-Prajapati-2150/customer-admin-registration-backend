// auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db'); // Import Knex instance
const router = express.Router();

// Registration Route
router.post('/register', async (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'User with this email already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into PostgreSQL
    await db('users').insert({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering user.' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role }, // Include the user's role in the token
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in.' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await db('users').select(
      'id',
      'first_name',
      'last_name',
      'email',
      'role'
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users.' });
  }
});

module.exports = router;
