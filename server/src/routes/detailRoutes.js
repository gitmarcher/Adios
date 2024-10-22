const express = require('express')
const { studentDetails, parentDetails} = require('../controllers/detailController')
// parentDetails, facultyDetails
const router =  new express.Router()

router.get('/student_details', studentDetails);
router.get('/parent_details', parentDetails);
// router.get('/faculty_detaails', facultyLogin);

module.exports = router; 