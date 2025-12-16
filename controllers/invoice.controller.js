const invoice = require('../modals').invoice;
const sendResponse = require('../utils/response');
const mongoose = require('mongoose');

const getInvoices = async (req, res, next) => {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    await invoice.aggregate([
        { $match: { userId: userId } },
        {
            $addFields: {
                items: {
                    $map: {
                        input: "$items",
                        as: "item",
                        in: {
                            name: "$$item.name",
                            price: "$$item.price",
                            quantity: "$$item.quantity",
                            discount: "$$item.discount",
                            discountType: "$$item.discountType",
                            id: "$$item.id",
                            itemTotal: {
                                $cond: [
                                    { $eq: ["$$item.discountType", "percentage"] },
                                    {
                                        $multiply: [
                                            "$$item.price",
                                            "$$item.quantity",
                                            { $subtract: [1, { $divide: ["$$item.discount", 100] }] }
                                        ]
                                    },
                                    {
                                        $subtract: [
                                            { $multiply: ["$$item.price", "$$item.quantity"] },
                                            "$$item.discount"
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                grandTotal: { $sum: "$items.itemTotal" }
            }
        },
        {
            $project: { grandTotal: 1, customerName: '$customerDetails.name', invoiceNumber: 1, invoiceDate: 1 }
        }
    ]).then((result, err) => {
        if (result) {
            sendResponse(res, 200, 200, true, 'Data retrieved successfully', result);
        } else {
            sendResponse(res, 200, 404, true, 'Error while data fetching', result);
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
            sendResponse(res, 200, 200, true, 'Invoice created successfully!', result);
        } else {
            sendResponse(res, 200, 403, false, 'Invoice creation failed', result);
        }
    });
}

module.exports = { getInvoices, createInvoice }