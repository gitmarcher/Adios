// src/index.js
require('dotenv').config();
const express = require('express');
const leaveRoutes = require('./routes/leaveRoutes');
const approvalRoutes = require('./routes/approvalRoutes');
const loginRoutes = require('./routes/authRoutes');
const logger = require('./utils/logger');
const bodyParser = require('body-parser');



const app = express();
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use('/api/leaves', leaveRoutes);
app.use('/api/approvals', approvalRoutes);
app.use(loginRoutes);


app.listen(PORT, () => {
  logger.log(`Server running at http://localhost:${PORT}`);
});
