const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./auth');
const authMiddleware = require('./authMiddleware');

dotenv.config();

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);

const PORT = process.env.DB_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Example of a protected route
app.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await db('users').where({ id: req.userId }).first();
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user data.' });
  }
});

app.use('/', (req, res) => {
  res.send(`<div>
    <h1>Welcome to Admin User Registration Portal</h1>
    </div>`);
});
