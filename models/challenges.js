'use strict'

const mongoose = require('mongoose');
const relationship = require('mongoose-relationship');

const challengeSchema = new mongoose.Schema ({
  authorId: String,       //  author id from users
  authorName: String,         //  author will be user from users
  challengeId: String,
  challengeTitle: String,
  description:String,
  comment: String,
  totalSubmitted: String,
  totalChallenged:String,
  created_at:String,
  captureURL:String,
  imageURL:String,
  popularity:Number
});

module.exports = mongoose.model('Challenge', challengeSchema );
