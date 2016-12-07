'use strict'

const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema ({
  creatorUserId: String || { type: mongoose.Schema.ObjectId, ref:'User' },
  challengeId: String,
  created_at: String,
  title: String,
  description: String,
  totalChallenged: String,
  totalSubmitted: String,
  imageURL: String,
});

module.exports = mongoose.model('Challenge', challengeSchema );
