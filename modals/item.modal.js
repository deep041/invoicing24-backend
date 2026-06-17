const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    name: { type: String },
    price: { type: Number },
    hsnCode: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
});