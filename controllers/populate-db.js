'use-strict';

const passport = require('koa-passport');
const uuid = require('uuid');

const User = require('../models').models.User;
const Challenge = require('../models').models.Challenge;
const populateData = require('./data.json');


//  grab the user document config from the data.json file
let userDocument = populateData.userDocument;
//  grab the challenge document config from the data.json file
let challengeDocument = populateData.challengeDocument;

//  declare function to create the new user document
let createUserDocument = (data, authId) => {
  userDocument.fbToken = uuid.v4();
  userDocument.authToken = authId;
  userDocument.profileInfo.fbId = "" + (Math.floor(Math.random() * 900000) + 100000);
  userDocument.profileInfo.firstName = data.firstName;
  userDocument.profileInfo.lastName = data.lastName;
  userDocument.profileInfo.picture = data.picture;
  userDocument.profileInfo.email = data.email;
  let newUser = new User(userDocument);
  newUser.save();
  console.log('New user has been created!');
};

//  declare functoin to create the new challenge document
let createChallengeDocument = (data, authId) => {
  challengeDocument.challengeId = "" + (Math.floor(Math.random() * 900000) + 100000);
  challengeDocument.creatorUserId = authId;
  challengeDocument.created_at = new Date();
  challengeDocument.title = data.title;
  challengeDocument.description = data.description;
  challengeDocument.totalChallenged = data.totalChallenged;
  challengeDocument.totalSubmitted = data.totalSubmitted;
  challengeDocument.imageURL = data.imageURL;
  let newChallenge = new Challenge(challengeDocument);
  console.log(newChallenge);
  newChallenge.save();
  console.log('New challenge has been created!');
};

exports.populateDb = function* (next) {
  let profileInfoArr = populateData.profileInfo;
  let challengesArr = populateData.challenges;
  for (let i = 0; i < profileInfoArr.length; i++) {
    let authId = uuid.v4();
    createChallengeDocument(challengesArr[i], authId);
    createUserDocument(profileInfoArr[i], authId);
  }
};
