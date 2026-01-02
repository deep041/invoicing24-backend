const express = require('express');
const router = express.Router();
const customer = require('../controllers').customer;
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, customer.getCustomers);
router.post('/', authenticateToken, customer.createCustomer);
router.post('/edit', authenticateToken, customer.editCustomer);

module.exports = router;