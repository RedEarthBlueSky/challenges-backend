'use strict'

const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema ({
  authorId: { type: String, ref:'User', required: true },  //  linked here
  "challengedUsers":
  [
    {
      userId: { type: mongoose.Schema.ObjectId, ref:'User' },
      name: String,
      picture: String,
      status: String,
      submissionId: String
    },
    {
      userId: { type: mongoose.Schema.ObjectId, ref:'User' },
      name: String,
      picture: String,
      status: String,
      submissionId: String
    },
    {
      userId: { type: mongoose.Schema.ObjectId, ref:'User' },
      name: String,
      picture: String,
      status: String,
      submissionId: String
    }
  ],
  challengeTypeId: { type: mongoose.Schema.ObjectId, ref:'Challenge' },
  comment: String,
  videoURL: String,
  captureURL: String,
});

module.exports = mongoose.model('Submission', submissionSchema );
