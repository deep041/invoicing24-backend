const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    improvementId: { type: mongoose.Schema.Types.ObjectId, ref: 'improvement', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    userName: { type: String },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
});
