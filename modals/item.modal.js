const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    name: { type: String },
    price: { type: Number },
    hsnCode: { type: String },
    gstRate: { type: Number, default: 18 },
    unit: { type: String, default: 'nos' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
});