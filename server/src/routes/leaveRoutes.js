const express = require('express');
const { getAllLeaves, createLeave } = require('../controllers/leaveController');

const router = express.Router();

router.get('/', getAllLeaves);

router.post('/', createLeave);

module.exports = router;
