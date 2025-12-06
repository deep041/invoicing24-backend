const mongoose = require('mongoose');

const userSchema = require('./user.modal');
const customerSchema = require('./customer.modal');
const itemSchema = require('./item.modal');
const companyDetailsSchema = require('./companyDetails.modal');
const invoiceSchema = require('./invoice.modal');

const user = mongoose.model('user', userSchema);
const customer = mongoose.model('customer', customerSchema);
const item = mongoose.model('item', itemSchema);
const companyDetails = mongoose.model('companyDetails', companyDetailsSchema);
const invoice = mongoose.model('invoice', invoiceSchema);

module.exports = { user, customer, item, companyDetails, invoice };
