const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    companyDetails: { 
        name: { type: String },
        contactNo: { type: String },
        address: { type: String },
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'companyDetails' }
    },
    customerDetails: { 
        name: { type: String },
        contactNo: { type: String },
        address: { type: String },
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'customer' }
    },
    invoiceNumber: { type: String },
    invoiceDate: { type: Date },
    discount: { type: Number },
    discountType: { type: String, enum: ['percentage', 'fixed'] },
    total: { type: Number },
    grandTotal: { type: Number },
    totalDiscountAmount: { type: Number },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
});