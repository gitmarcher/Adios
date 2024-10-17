// src/index.js
const express = require('express');
const dotenv = require('dotenv');
const leaveRoutes = require('./routes/leaveRoutes');
const sequelize = require('./config/database');
const logger = require('./utils/logger');

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/leaves', leaveRoutes);

sequelize.authenticate()
  .then(() => logger.log('Database connected'))
  .catch((error) => logger.log(`Database connection failed: ${error.message}`));

app.listen(PORT, () => {
  logger.log(`Server running at http://localhost:${PORT}`);
});
