'use strict'

const mongoose = require('mongoose');
const relationship = require('mongoose-relationship');

const submissionSchema = new mongoose.Schema ({
  id:number,
  feed:String,                //  where does this - feed - come from?
  authorId: String,           //  author id from user
  authorName: String,         //  author will be user from user
  challengeTypeId: String,
  challengeTitle: String,
  description:String,[{
    type: mongoose.Schema.ObjectId,
    ref: 'Description',
    childPath: 'submissions'
  }],
  comment: String,
  totalSubmitted: String,
  created_at:String,
  captureURL:String,
  videoURL:String,
  challengedUsers: [{userId:string, status:string},
    {userId:string, status:string},
    {userId:string, status:string}
  ]
});

module.exports = mongoose.model('Submission', submissionSchema );
