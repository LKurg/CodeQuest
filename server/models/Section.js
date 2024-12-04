const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['text', 'code'], required: true }, // "text" for rich text, "code" for code sections
    content: { type: String }, // For rich text content
    codeSnippet: { type: String }, // For code sections
    language: { type: String }, // Optional: e.g., "JavaScript", "Python" for syntax highlighting
    tutorial: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutorial', required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Section', sectionSchema);
