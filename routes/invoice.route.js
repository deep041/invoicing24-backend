const express = require('express');
const router = express.Router();
const invoice = require('../controllers').invoice;
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, invoice.getInvoices);
router.post('/', authenticateToken, invoice.createInvoice);

module.exports = router;