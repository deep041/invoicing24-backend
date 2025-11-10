const router = require('express').Router();

const user = require('./user.route');
const loginRegister = require('./login_register.route');
const customer = require('./customer.route');
const item = require('./item.route');

router.use('/user', user);
router.use('/authenticate', loginRegister);
router.use('/customer', customer);
router.use('/item', item);

module.exports = router;