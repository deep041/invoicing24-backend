const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    name: { type: String },
    contactNo: { type: String },
    address: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
});