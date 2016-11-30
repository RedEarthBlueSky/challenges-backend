'use strict'

const mongoose = require('mongoose');
const relationship = require('mongoose-relationship');

const challengeSchema = new mongoose.Schema ({
  id: String,
  creatorUserId: String,
  created_at: String,
  title: String,
  description: String,
  totalChallenged: String,
  totalSubmitted: String,
  imageURL: String
});

module.exports = mongoose.model('Challenge', challengeSchema );
