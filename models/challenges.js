'use strict'

const mongoose = require('mongoose');
const relationship = require('mongoose-relationship');

const challengeSchema = new mongoose.Schema ({
  authorId: String,       //  author id from users
  authorName: String,         //  author will be user from users
  challengeId: String,
  challengeTitle: String,
  description:String,[{
    type: mongoose.Schema.ObjectId,
    ref: 'Description',
    childPath: 'challenges'
  }],
  comment: String,
  totalSubmitted: String,
  created_at:String,
  captureURL:String,
  videoURL:String,
  popularity:Number
});

module.exports = mongoose.model('Challenge', challengeSchema );
