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
    items: [{ 
        name: { type: String },
        price: { type: Number },
        quantity: { type: Number },
        discount: { type: Number },
        discountType: { type: String, enum: ['percentage', 'fixed'] },
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'item' }
    }],
    invoiceNumber: { type: String },
    invoiceDate: { type: Date },
    discount: { type: Number },
    discountType: { type: String, enum: ['percentage', 'fixed'] },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
});