const item = require('../modals').item;
const invoices = require('../modals').invoice;
const customers = require('../modals').customer;
const invoiceItems = require('../modals').invoiceItems;
const sendResponse = require('../utils/response');
const mongoose = require('mongoose');

const getDashboardData = async (req, res, next) => {
    try {
        const userID = req.user.id;

        const invoiceCount = await invoices.countDocuments({ 'userId': userID });
        const itemCount = await item.countDocuments({ 'userId': userID });
        const customerCount = await customers.countDocuments({ 'userId': userID });
        const sales = await invoiceItems.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userID) } },
            {
                $group: {
                    _id: null,
                    netAmount: { $sum: "$netAmount" }
                }
            }
        ]);

        const salesPerMonth = await invoiceItems.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userID) } },
            {
                $lookup: {
                    from: "invoices",
                    localField: "invoiceId",
                    foreignField: "_id",
                    as: "invoiceDetails"
                }
            },
            { $unwind: "$invoiceDetails" },
            {
                $group: {
                    _id: { month: { $month: "$invoiceDetails.invoiceDate" }, year: { $year: "$invoiceDetails.invoiceDate" } },
                    totalSales: { $sum: "$netAmount" }
                }
            },
            {
                $project: {
                    month: "$_id.month",
                    year: "$_id.year",
                    totalSales: 1,
                    _id: 0
                }
            },
            { $sort: { year: 1, month: 1 } }
        ]);

        console.log(sales);
        const dashboardData = {
            invoiceCount: invoiceCount,
            itemCount: itemCount,
            customerCount: customerCount,
            totalSales: sales.length > 0 ? sales[0].netAmount : 0,
            salesPerMonth
        };

        sendResponse(res, 200, 200, true, 'Data retrieved successfully', dashboardData);        
    } catch (error) {
        console.log(error)
        return sendResponse(res, 500, 500, false, 'Internal Server Error', null);
    }
}

module.exports = { getDashboardData }