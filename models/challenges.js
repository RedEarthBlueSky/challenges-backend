'use strict'

const mongoose = require('mongoose');
const relationship = require('mongoose-relationship');

const challengeSchema = new mongoose.Schema ({
  challengeId: String,
  creatorUserId: String,
  creatorName: String,
  created_at: String,
  title: String,
  comment: String,
  description: String,
  totalChallenged: String,
  totalSubmitted: String,
  picture: String
});

module.exports = mongoose.model('Challenge', challengeSchema );
