// src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('./utils/logger');
const leaveRoutes = require('./routes/leaveRoutes');
const approvalRoutes = require('./routes/approvalRoutes');
const loginRoutes = require('./routes/authRoutes');
const detailRoutes = require('./routes/detailRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Adjust this to your frontend URL
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/api/leaves', leaveRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/auth', loginRoutes);
app.use('/api/details', detailRoutes);

app.listen(PORT, () => {
  logger.log(`Server running at http://localhost:${PORT}`);
});