'use strict';

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  "fbToken": { type: String, index: { unique: true }},
  "authToken": { type: String, index: { unique: true }},
  "profile": [{ fbId:String, username:String, email:String }]
});

module.exports = mongoose.model('User', eventSchema);
