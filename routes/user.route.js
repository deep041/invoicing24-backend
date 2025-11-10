const express = require('express');
const router = express.Router();
const user = require('../controllers').user;
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, user.getAllUsers);

module.exports = router;