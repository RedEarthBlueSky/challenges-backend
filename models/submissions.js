'use strict'

const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema ({
  authorId: { type: String, ref:'User', required: true },  //  linked here
  "challengedUsers":
  [
    {
      userId: String,
      name: String,
      status: String,
      submissionId: String
    },
    {
      userId: String,
      name: String,
      status: String,
      submissionId: String
    },
    {
      userId: String,
      name: String,
      status: String,
      submissionId: String
    }
  ],
  challengeTypeId: String,
  comment: String,
  videoURL: String,
  captureURL: String,
});

module.exports = mongoose.model('Submission', submissionSchema );
