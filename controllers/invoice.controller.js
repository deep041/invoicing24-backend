const invoice = require('../modals').invoice;
const sendResponse = require('../utils/response');

const getInvoices = async (req, res, next) => {
    await invoice.find({ 'userId': req.user.id }).then((result, err) => {
        if (result) {
            sendResponse(res, 200, 200, true, 'Data retrieved successfully', result);
        } else {
            sendResponse(res, 200, 404, true, 'Failed', result);
        }
    });
}

const createInvoice = async (req, res, next) => {
    let invoiceData = {
        companyDetails: { 
            name: req.body.companyDetails.name,
            contactNo: req.body.companyDetails.contactNo,
            address: req.body.companyDetails.address,
            id: req.body.companyDetails.id
        },
        customerDetails: { 
            name: req.body.customerDetails.name,
            contactNo: req.body.customerDetails.contactNo,
            address: req.body.customerDetails.address,
            id: req.body.customerDetails.id
        },
        items: req.body.items.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            discount: item.discount,
            discountType: item.discountType,
            id: item.id
        })),
        invoiceNumber: req.body.invoiceNumber,
        invoiceDate: req.body.invoiceDate,
        discount: req.body.discount,
        discountType: req.body.discountType,
        userId: req.user.id
    }

    invoice.create(invoiceData).then((result, err) => {
        if (result) {
            sendResponse(res, 200, 200, true, 'Item created successfully!', result);
        } else {
            sendResponse(res, 200, 403, false, 'Item creation failed', result);
        }
    });
}

module.exports = { getInvoices, createInvoice }