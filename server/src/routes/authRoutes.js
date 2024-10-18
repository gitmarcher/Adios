const express = require('express')
const { studentLogin, parentLogin, facultyLogin } = require('../controllers/authController')

const router =  new express.Router()

router.post('/student_login', studentLogin);
router.post('/parent_login', parentLogin);
router.post('/faculty_login', facultyLogin);

module.exports = router; 