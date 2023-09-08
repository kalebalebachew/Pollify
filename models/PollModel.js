// models/PollModel.js

const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
  question: String,
  options: [String],
  votes: [String], 
});

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
