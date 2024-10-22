const express = require('express');
const {  createLeave,deleteLeave,getLeaveDetails } = require('../controllers/leaveController');

const router = express.Router();


router.post('/create_leave', createLeave);

router.delete('/delete_leave', deleteLeave);

router.get('/get_leave_details', getLeaveDetails);

module.exports = router;
