const customer = require('../modals').customer;
const sendResponse = require('../utils/response');

const getCustomers = async (req, res, next) => {
    await customer.find({ 'userId': req.user.id }).then((result, err) => {
        if (result) {
            sendResponse(res, 200, 200, true, 'Data retrieved successfully', result);
        } else {
            sendResponse(res, 200, 404, true, 'Failed', result);
        }
    });
}

const createCustomer = async (req, res, next) => {
    let customerData = {
        name: req.body.name,
        contactNo: req.body.contactNo,
        address: req.body.address,
        userId: req.user.id
    }

    customer.create(customerData).then((result, err) => {
        if (result) {
            sendResponse(res, 200, 200, true, 'Customer created successfully!', result);
        } else {
            sendResponse(res, 200, 403, false, 'Customer creation failed', result);
        }
    });
}

module.exports = { getCustomers, createCustomer }