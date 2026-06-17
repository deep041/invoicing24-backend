const customer = require('../modals').customer;
const sendResponse = require('../utils/response');
const { parsePagination, buildPaginatedResponse } = require('../utils/pagination');

const getCustomers = async (req, res, next) => {
    const { page, limit, skip } = parsePagination(req);
    const filter = { userId: req.user.id };

    try {
        const [total, result] = await Promise.all([
            customer.countDocuments(filter),
            customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
        ]);

        sendResponse(
            res,
            200,
            200,
            true,
            'Data retrieved successfully',
            buildPaginatedResponse(result, total, page, limit)
        );
    } catch (error) {
        sendResponse(res, 500, 500, false, 'Failed to retrieve customers', null);
    }
}

const createCustomer = async (req, res, next) => {
    let customerData = {
        name: req.body.name,
        contactNo: req.body.contactNo,
        address: req.body.address,
        gstNo: req.body.gstNo,
        stateCode: req.body.stateCode,
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

const editCustomer = async (req, res, next) => {
    let customerData = {
        name: req.body.name,
        contactNo: req.body.contactNo,
        address: req.body.address,
        gstNo: req.body.gstNo,
        stateCode: req.body.stateCode,
        userId: req.user.id,
        id: req.body.id
    }

    customer.updateOne({ _id: customerData.id, userId: req.user.id }, { $set: { name: customerData.name, contactNo: customerData.contactNo, address: customerData.address } }).then((result, err) => {
        if (result) {
            sendResponse(res, 200, 200, true, 'Customer updated successfully!', result);
        } else {
            sendResponse(res, 200, 403, false, 'Customer update failed', result);
        }
    });
}

module.exports = { getCustomers, createCustomer, editCustomer }