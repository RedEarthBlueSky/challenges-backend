'use strict'

const mongoose = require('mongoose');
const relationship = require('mongoose-relationship');

const submissionSchema = new mongoose.Schema ({
  authorId: { type: String, require: true },  //  linked here
  challengedUser1: {
    userId: String,
    status: String,
    submissionId: String
  },
  challengedUser2:  {
    userId: String,
    status: String,
    submissionId: String
  },
  challengedUser3: {
    userId: String,
    status: String,
    submissionId: String
  },
  challengeTypeId: String,
  comment: String,
  videoURL: String,
  captureURL: String,
  users:[{type: mongoose.Schema.ObjectId, ref: 'User', childPath: 'users'}],
  challenges:[{type: mongoose.Schema.ObjectId, ref: 'Challenge', childPath: 'challenges'}]
});

submissionSchema.plugin(relationship, {relationshipPathName: 'users'});
submissionSchema.plugin(relationship, {relationshipPathName: 'challenges'});
module.exports = mongoose.model('Submission', submissionSchema );
