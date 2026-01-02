const invoice = require('../modals').invoice;
const invoiceItems = require('../modals').invoiceItems;
const sendResponse = require('../utils/response');
const mongoose = require('mongoose');

const getInvoices = async (req, res, next) => {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    await invoice.aggregate([
        { $match: { userId: userId } },
        {
            $lookup: {
              from: "invoiceitems",          // collection name (NOT model name)
              localField: "_id",   // field in orders
              foreignField: "invoiceId",    // field in users
              as: "items"
            }
        },
        {
            $addFields: {
                items: {
                    $map: {
                        input: "$items",
                        as: "item",
                        in: {
                            itemTotal: "$$item.netAmount"
                        }
                    }
                }
            }
        },
        {
            $addFields: {
                grandTotal: { $subtract: [ { $sum: "$items.itemTotal" }, { $ifNull: ["$totalDiscountAmount", 0] } ] }
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
            discountValue: item.discountValue,
            amount: item.amount,
            netAmount: item.netAmount,
            id: item.id
        })),
        invoiceNumber: req.body.invoiceNumber,
        invoiceDate: req.body.invoiceDate,
        discount: req.body.discount,
        discountType: req.body.discountType,
        total: req.body.total,
        grandTotal: req.body.grandTotal,
        totalDiscountAmount: req.body.totalDiscountAmount,
        userId: req.user.id
    }

    let invoiceNumber = await invoice.findOne({ userId: req.user.id }).sort({ invoiceNumber: -1 });
    if (invoiceNumber && invoiceNumber.invoiceNumber) {
        invoiceData.invoiceNumber = Number(invoiceNumber.invoiceNumber) + 1;
    } else {
        invoiceData.invoiceNumber = 1;
    }

    invoice.create(invoiceData).then((result, err) => {
        if (result) {
            invoiceItems.insertMany(invoiceData.items.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                discount: item.discount,
                discountType: item.discountType,
                itemId: item.id,
                invoiceNumber: invoiceData.invoiceNumber,
                invoiceId: result._id,
                discountValue: item.discountValue,
                amount: item.amount,
                netAmount: item.netAmount,
                userId: req.user.id
            }))).then(result2 => {
                sendResponse(res, 200, 200, true, 'Invoice created successfully!', [result, result2]);
            });
        } else {
            sendResponse(res, 200, 403, false, 'Invoice creation failed', result);
        }
    });
}

const getInvoiceById = async (req, res, next) => {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const invoiceId = new mongoose.Types.ObjectId(req.params.id);
    await invoice.aggregate([
        { $match: { userId: userId, _id: invoiceId } },
        {
            $lookup: {
              from: "invoiceitems",          // collection name (NOT model name)
              localField: "_id",   // field in orders
              foreignField: "invoiceId",    // field in users
              as: "items"
            }
        }
    ]).then((result, err) => {
        if (result) {
            sendResponse(res, 200, 200, true, 'Data retrieved successfully', result);
        } else {
            sendResponse(res, 200, 404, true, 'Error while data fetching', result);
        }
    });
}

const getLatestInvoiceNumber = async (req, res, next) => {
    const userId = req.user.id;
    console.log(userId)
    await invoice.findOne({ userId: userId }).sort({ invoiceNumber: -1 }).then((result, err) => {
        if (result) {
            let invoiceNumber = 1;
            if (result && result.invoiceNumber) {
                invoiceNumber = Number(result.invoiceNumber) + 1;
            }
            sendResponse(res, 200, 200, true, 'Data retrieved successfully', { invoiceNumber });
        } else {
            sendResponse(res, 200, 404, true, 'Error while data fetching', result);
        }
    });
}

module.exports = { getInvoices, createInvoice, getInvoiceById, getLatestInvoiceNumber }