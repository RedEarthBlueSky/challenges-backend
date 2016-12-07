'use-strict';

const passport = require('koa-passport');
const uuid = require('uuid');

const User = require('../models').models.User;
const Challenge = require('../models').models.Challenge;
const Submission = require('../models').models.Submission;
const populateData = require('./data.json');


//  grab the user, challenge and submission document config from the data.json file
let userDocument = populateData.userDocument;
let challengeDocument = populateData.challengeDocument;
let submissionDocument = populateData.submissionDocument;

//  define function to create the new user document
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
//  define function to create the new challenge document
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
//  define function to create the new submission document
let createSubmissionDocument = (data, authId) => {
  submissionDocument.authorId = authId;
  submissionDocument.challengedUsers[0].userId = data.challengedUsers[0].userId;
  submissionDocument.challengedUsers[0].name = data.challengedUsers[0].name;
  submissionDocument.challengedUsers[0].picture = data.challengedUsers[0].picture;
  submissionDocument.challengedUsers[0].status = data.challengedUsers[0].status;
  submissionDocument.challengedUsers[0].submissionId = data.challengedUsers[0].submissionId;
  submissionDocument.challengedUsers[1].userId = data.challengedUsers[1].userId;
  submissionDocument.challengedUsers[1].name = data.challengedUsers[1].name;
  submissionDocument.challengedUsers[1].picture = data.challengedUsers[1].picture;
  submissionDocument.challengedUsers[1].status = data.challengedUsers[0].status;
  submissionDocument.challengedUsers[1].submissionId = data.challengedUsers[1].submissionId;
  submissionDocument.challengedUsers[2].userId = data.challengedUsers[2].userId;
  submissionDocument.challengedUsers[2].name = data.challengedUsers[2].name;
  submissionDocument.challengedUsers[2].picture = data.challengedUsers[2].picture;
  submissionDocument.challengedUsers[2].status = data.challengedUsers[0].status;
  submissionDocument.challengedUsers[2].submissionId = data.challengedUsers[2].submissionId;
  submissionDocument.challengeTypeId = data.challengeTypeId;
  submissionDocument.comment = data.comment;
  submissionDocument.videoURL = data.videoURL;
  submissionDocument.captureURL = data.captureURL;
  let newSubmission = new Submission(submissionDocument);
  console.log(newSubmission);
  newSubmission.save();
  console.log('New submission has been created!');
};


exports.populateDb = function* (next) {
  let profileInfoArr = populateData.profileInfo;
  let challengesArr = populateData.challenges;
  let submissionsArr = populateData.submissions;
  for (let i = 0; i < profileInfoArr.length; i++) {
    let authId = uuid.v4();
    // createChallengeDocument(challengesArr[i], authId);
    // createUserDocument(profileInfoArr[i], authId);
    createSubmissionDocument(submissionsArr[i], authId);
  }
};
