'use strict'

const mongoose = require('mongoose');
const relationship = require('mongoose-relationship');

const submissionSchema = new mongoose.Schema ({
  _id:Number,
  feed:String,                //  where does this - feed - come from?
  authorId: String,           //  author id from user
  author: [{ type: mongoose.Schema.ObjectId, ref: ''}],
  challengeTypeId: String,
  challengeTitle: String,
  description:String,
  comment: String,
  totalSubmitted: String,
  created_at:String,
  captureURL:String,
  videoURL:String,
  challengedUsers: [{userId:String, status:String},
    {userId:String, status:String},
    {userId:String, status:String}
  ]
});

module.exports = mongoose.model('Submission', submissionSchema );
