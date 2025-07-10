const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  genre: { type: String },
  status: { type: String, enum: ['available', 'borrowed'], default: 'available' },
});

module.exports = mongoose.model('Book', bookSchema);