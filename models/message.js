const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  _id: String,
  user: String,
  text: String,
  timestamp: String,
  question: String
  },{ _id: false, versionKey: false }
);

module.exports = mongoose.model('Message', messageSchema);