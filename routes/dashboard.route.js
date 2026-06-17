const express = require('express');
const router = express.Router();
const dashboard = require('../controllers').dashboard;
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, dashboard.getDashboardData);

module.exports = router;