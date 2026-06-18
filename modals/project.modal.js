const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    commentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'improvementComment' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
});
