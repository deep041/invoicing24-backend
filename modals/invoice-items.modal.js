const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    name: { type: String },
    hsnCode: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    discount: { type: Number },
    discountType: { type: String, enum: ['percentage', 'fixed'] },
    discountValue: { type: Number },
    amount: { type: Number },
    netAmount: { type: Number },
    gstRate: { type: Number },
    taxableAmount: { type: Number },
    gstAmount: { type: Number },
    cgstAmount: { type: Number },
    sgstAmount: { type: Number },
    igstAmount: { type: Number },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'item' },
    invoiceNumber: { type: String },
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'invoice' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
});