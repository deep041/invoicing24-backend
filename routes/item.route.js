const express = require('express');
const router = express.Router();
const item = require('../controllers').item;
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, item.getItems);
router.post('/', authenticateToken, item.createItem);
router.post('/edit', authenticateToken, item.editItem);

module.exports = router;