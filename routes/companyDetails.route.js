const express = require('express');
const router = express.Router();
const companyDetails = require('../controllers').companyDetails;
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, companyDetails.getCompanyDetails);
router.post('/', authenticateToken, companyDetails.addCompanyDetails);


module.exports = router;