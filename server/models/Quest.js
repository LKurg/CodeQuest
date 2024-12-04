const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Quest', questSchema);
