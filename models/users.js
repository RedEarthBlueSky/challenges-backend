'use strict';

const mongoose = require('mongoose');
const relationship = require("mongoose-relationship");

const eventSchema = new mongoose.Schema({
  "fbToken": { type: String, index: { unique: true }},
  "authToken": { type: String, index: { unique: true }},
  "profileInfo": {
    fbId:{ type: String, index: { unique: true }},
    firstName:String,
    lastName:String,
    picture:String,
    email:String,
  },
  submission: [{ type: mongoose.Schema.ObjectId, ref:"Submission"}],
  challenge: [{type:mongoose.Schema.ObjectId, ref:"Challenge"}]
});

module.exports = mongoose.model('User', eventSchema);
