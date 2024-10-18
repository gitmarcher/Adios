const express = require('express');
const {  createLeave,deleteLeave } = require('../controllers/leaveController');

const router = express.Router();


router.post('/create_leave', createLeave);

router.delete('/delete_leave', deleteLeave);

module.exports = router;
