const mongoose = require('mongoose');

const userSchema = require('./user.modal');
const customerSchema = require('./customer.modal');
const itemSchema = require('./item.modal');
const companyDetailsSchema = require('./companyDetails.modal');
const invoiceSchema = require('./invoice.modal');
const invoiceItemsSchema = require('./invoice-items.modal');
const improvementSchema = require('./improvement.modal');
const improvementCommentSchema = require('./improvement-comment.modal');
const projectSchema = require('./project.modal');

const user = mongoose.model('user', userSchema);
const customer = mongoose.model('customer', customerSchema);
const item = mongoose.model('item', itemSchema);
const companyDetails = mongoose.model('companyDetails', companyDetailsSchema);
const invoice = mongoose.model('invoice', invoiceSchema);
const invoiceItems = mongoose.model('invoiceItems', invoiceItemsSchema);
const improvement = mongoose.model('improvement', improvementSchema);
const improvementComment = mongoose.model('improvementComment', improvementCommentSchema);
const project = mongoose.model('project', projectSchema);

module.exports = { user, customer, item, companyDetails, invoice, invoiceItems, improvement, improvementComment, project };
