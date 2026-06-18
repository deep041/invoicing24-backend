const router = require('express').Router();

const user = require('./user.route');
const loginRegister = require('./login_register.route');
const customer = require('./customer.route');
const item = require('./item.route');
const companyDetails = require('./companyDetails.route');
const invoice = require('./invoice.route');
const dashboard = require('./dashboard.route');
const improvement = require('./improvement.route');
const project = require('./project.route');

router.use('/user', user);
router.use('/authenticate', loginRegister);
router.use('/customer', customer);
router.use('/item', item);
router.use('/company-details', companyDetails);
router.use('/invoice', invoice);
router.use('/dashboard', dashboard);
router.use('/improvement', improvement);
router.use('/project', project);

module.exports = router;