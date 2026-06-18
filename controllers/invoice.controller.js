const invoice = require('../modals').invoice;
const invoiceItems = require('../modals').invoiceItems;
const sendResponse = require('../utils/response');
const { parsePagination, buildPaginatedResponse } = require('../utils/pagination');
const { buildRegexSearch } = require('../utils/search');
const mongoose = require('mongoose');

const getNextInvoiceNumber = async (userId) => {
    const [latest] = await invoice.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
            $addFields: {
                invoiceNumberNumeric: {
                    $convert: { input: '$invoiceNumber', to: 'int', onError: 0, onNull: 0 }
                }
            }
        },
        { $sort: { invoiceNumberNumeric: -1 } },
        { $limit: 1 },
        { $project: { invoiceNumberNumeric: 1 } }
    ]);

    return (latest?.invoiceNumberNumeric ?? 0) + 1;
};

const getInvoices = async (req, res, next) => {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const { page, limit, skip } = parsePagination(req);
    const searchRegex = buildRegexSearch(req.query.search);
    const pipeline = [
        { $match: { userId: userId } },
        {
            $project: { grandTotal: 1, customerName: '$customerDetails.name', invoiceNumber: 1, invoiceDate: 1 }
        }
    ];

    if (searchRegex) {
        pipeline.push({
            $match: {
                $or: [
                    { invoiceNumber: searchRegex },
                    { customerName: searchRegex }
                ]
            }
        });
    }

    pipeline.push(
        { $sort: { invoiceDate: -1 } },
        {
            $facet: {
                metadata: [{ $count: 'total' }],
                data: [{ $skip: skip }, { $limit: limit }]
            }
        }
    );

    try {
        const [result] = await invoice.aggregate(pipeline);

        const total = result.metadata[0]?.total || 0;
        sendResponse(
            res,
            200,
            200,
            true,
            'Data retrieved successfully',
            buildPaginatedResponse(result.data, total, page, limit)
        );
    } catch (error) {
        sendResponse(res, 500, 500, false, 'Error while data fetching', null);
    }
}

const createInvoice = async (req, res, next) => {
    let invoiceData = {
        companyDetails: {
            name: req.body.companyDetails.name,
            contactNo: req.body.companyDetails.contactNo,
            address: req.body.companyDetails.address,
            gstNo: req.body.companyDetails.gstNo,
            stateCode: req.body.companyDetails.stateCode,
            id: req.body.companyDetails.id
        },
        customerDetails: {
            name: req.body.customerDetails.name,
            contactNo: req.body.customerDetails.contactNo,
            address: req.body.customerDetails.address,
            gstNo: req.body.customerDetails.gstNo,
            stateCode: req.body.customerDetails.stateCode,
            id: req.body.customerDetails.id
        },
        items: req.body.items.map(item => ({
            name: item.name,
            hsnCode: item.hsnCode,
            price: item.price,
            quantity: item.quantity,
            discount: item.discount,
            discountType: item.discountType,
            discountValue: item.discountValue,
            amount: item.amount,
            netAmount: item.netAmount,
            gstRate: item.gstRate,
            taxableAmount: item.taxableAmount,
            gstAmount: item.gstAmount,
            cgstAmount: item.cgstAmount,
            sgstAmount: item.sgstAmount,
            igstAmount: item.igstAmount,
            id: item.id
        })),
        invoiceNumber: req.body.invoiceNumber,
        invoiceDate: req.body.invoiceDate,
        discount: req.body.discount,
        discountType: req.body.discountType,
        total: req.body.total,
        grandTotal: req.body.grandTotal,
        totalDiscountAmount: req.body.totalDiscountAmount,
        taxableAmount: req.body.taxableAmount,
        cgstAmount: req.body.cgstAmount,
        sgstAmount: req.body.sgstAmount,
        igstAmount: req.body.igstAmount,
        totalGstAmount: req.body.totalGstAmount,
        isInterState: req.body.isInterState,
        userId: req.user.id
    }

    invoiceData.invoiceNumber = await getNextInvoiceNumber(req.user.id);

    invoice.create(invoiceData).then((result, err) => {
        if (result) {
            invoiceItems.insertMany(invoiceData.items.map(item => ({
                name: item.name,
                hsnCode: item.hsnCode,
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
                gstRate: item.gstRate,
                taxableAmount: item.taxableAmount,
                gstAmount: item.gstAmount,
                cgstAmount: item.cgstAmount,
                sgstAmount: item.sgstAmount,
                igstAmount: item.igstAmount,
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
    try {
        const invoiceNumber = await getNextInvoiceNumber(req.user.id);
        sendResponse(res, 200, 200, true, 'Data retrieved successfully', { invoiceNumber });
    } catch (error) {
        sendResponse(res, 500, 500, false, 'Error while data fetching', null);
    }
}

module.exports = { getInvoices, createInvoice, getInvoiceById, getLatestInvoiceNumber }