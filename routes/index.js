const router = require('express').Router();

const user = require('./user.route');
const loginRegister = require('./login_register.route');
const customer = require('./customer.route');
const item = require('./item.route');
const companyDetails = require('./companyDetails.route');
const invoice = require('./invoice.route');

router.use('/user', user);
router.use('/authenticate', loginRegister);
router.use('/customer', customer);
router.use('/item', item);
router.use('/company-details', companyDetails);
router.use('/invoice', invoice);

module.exports = router;