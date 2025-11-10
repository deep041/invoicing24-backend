const express = require('express');
const router = express.Router();
const loginRegister = require('../controllers').loginRegister;

router.post('/login', loginRegister.login);
router.post('/register', loginRegister.register);

module.exports = router;