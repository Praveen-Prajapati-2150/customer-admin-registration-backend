const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./auth');
const authMiddleware = require('./authMiddleware');

dotenv.config();

const app = express();

// app.use(cors());
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:3000', // Allow requests only from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
    credentials: true, // If using cookies for authentication
  })
);

const PORT = process.env.DB_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use('/auth', authRoutes);


app.use('/', (req, res) => {
  res.send(`<div>
    <h1>Welcome to Admin User Registration Portal</h1>
    </div>`);
});
