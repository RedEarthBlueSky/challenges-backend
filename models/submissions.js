'use strict'

const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema ({
  authorId: { type: mongoose.Schema.ObjectId, ref:'User'},  //  linked here
  "challengedUsers":
  [
    {
      userId: String,
      name: String,
      picture: String,
      status: String,
      submissionId: String
    },
    {

      userId: String,
      name: String,
      picture: String,
      status: String,
      submissionId: String
    },
    {
      userId: String,
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
