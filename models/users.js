'use strict';

const mongoose = require('mongoose');

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
});

module.exports = mongoose.model('User', eventSchema);
