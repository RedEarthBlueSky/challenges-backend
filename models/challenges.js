'use strict'

const mongoose = require('mongoose');
const relationship = require('mongoose-relationship');

const challengeSchema = new mongoose.Schema ({
  id: String,
  creatorUserId: String,
  users: [{ type: mongoose.Schema.ObjectId, ref: 'User', childPath: 'challenges'}],
  created_at: String,
  title: String,
  description: String,
  totalChallenged: String,
  totalSubmitted: String,
  imageURL: String,
});

challengeSchema.plugin(relationship, {relationshipPathName:'users'});
module.exports = mongoose.model('Challenge', challengeSchema );
