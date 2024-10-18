// src/index.js

require('dotenv').config();


const express = require('express');
const leaveRoutes = require('./routes/leaveRoutes');
const logger = require('./utils/logger');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/leaves', leaveRoutes);


app.listen(PORT, () => {
  logger.log(`Server running at http://localhost:${PORT}`);
});
