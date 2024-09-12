const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const authMiddleware = require('./authMiddleware');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;

  try {
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const userWithoutPassword = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    };

    res.json({ token, user: userWithoutPassword });
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
      'role',
      'password'
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users.' });
  }
});

router.get('/profile/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  console.log('🚀 ~ file: auth.js:89 ~ router.get ~ id:', id);

  try {
    const user = await db('users').where({ id }).first();

    console.log('🚀 ~ file: auth.js:95 ~ router.get ~ user:', user);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user data.' });
  }
});

module.exports = router;
