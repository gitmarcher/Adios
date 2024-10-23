const express = require('express');
const {  getLeaves,parentConsent,facultyApproval,facultyAdvisorApplications, wardenApplications, wardenApproval,academicsApplications, academicsApproval,parentDisapproval } = require('../controllers/approvalController');
const multer = require('multer');

const upload = multer();

const router = express.Router();


router.get('/get_leaves', getLeaves);

router.post('/parent_consent',upload.single('parent_image'), parentConsent);

router.get('/faculty_approval', facultyAdvisorApplications);

router.patch('/faculty_approval', facultyApproval);

router.get('/warden_approval', wardenApplications);

router.patch('/warden_approval', wardenApproval);

router.get('/academics_approval', academicsApplications);

router.patch('/academics_approval', academicsApproval);

router.patch('/parent_disapproval', parentDisapproval);

module.exports = router;
