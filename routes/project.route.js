const express = require('express');
const router = express.Router();
const project = require('../controllers').project;
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, project.getProjects);
router.post('/', authenticateToken, project.createProject);

module.exports = router;
