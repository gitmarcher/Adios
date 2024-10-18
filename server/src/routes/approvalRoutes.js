const express = require('express');
const {  getLeaves,parentConsent,facultyApproval,facultyAdvisorApplications, wardenApplications } = require('../controllers/approvalController');
const multer = require('multer');

const upload = multer();

const router = express.Router();


router.get('/get_leaves', getLeaves);

router.post('/parent_consent',upload.single('parent_image'), parentConsent);

router.get('/faculty_approval', facultyAdvisorApplications);

router.patch('/faculty_approval', facultyApproval);

router.get('/warden_approval', wardenApplications);

module.exports = router;
