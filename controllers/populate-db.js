'use-strict';

const passport = require('koa-passport');
const uuid = require('uuid');

const User = require('../models').models.User;
const Challenge = require('../models').models.Challenge;
const Submission = require('../models').models.Submission;
const populateData = require('./data.json');

let userDocument = populateData.userDocument;
let challengeDocument = populateData.challengeDocument;
let submissionDocument = populateData.submissionDocument;

let createUserDocument = function * (data, authId) {
  userDocument.fbToken = uuid.v4();
  userDocument.authToken = authId;
  userDocument.profileInfo.fbId = "" + (Math.floor(Math.random() * 900000) + 100000);
  userDocument.profileInfo.firstName = data.firstName;
  userDocument.profileInfo.lastName = data.lastName;
  userDocument.profileInfo.picture = data.picture;
  userDocument.profileInfo.email = data.email;
  let newUser = new User(userDocument);
  yield newUser.save();
  console.log('New user has been created!');
};

let createChallengeDocument = function * (data, id) {
  challengeDocument.challengeId = "" + (Math.floor(Math.random() * 900000) + 100000);
  //  this from the users collection
  challengeDocument.creatorUserId = id;
  challengeDocument.created_at = new Date();
  challengeDocument.title = data.title;
  challengeDocument.description = data.description;
  challengeDocument.totalChallenged = data.totalChallenged;
  challengeDocument.totalSubmitted = data.totalSubmitted;
  challengeDocument.imageURL = data.imageURL;
  newChallenge = new Challenge(challengeDocument);
  yield newChallenge.save();
  console.log('New challenge has been created!');
};

let createSubmissionDocument = function * (data, authorId, id) {
  submissionDocument.authorId = authorId;
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

  submissionDocument.challengeTypeId = id;

  let newSubmission = new Submission(submissionDocument);
  newSubmission.save();
  console.log('New submission has been created!');
};

exports.populateDb = function* (next) {
  let users;
  let challenges;

  let userArr = populateData.userProfileInfo;
  for (let i = 0; i < userArr.length; i++) {
    yield createUserDocument(userArr[i], uuid.v4());
  }

  try {
    users = yield User.find()
  } catch(err) {
    console.log('Error getting users *: ' + err);
  }

  let challengesArr = populateData.challenges;
  for (let i = 0; i < challengesArr.length; i++) {
     let id = users[i]._id;
     yield createChallengeDocument(challengesArr[i], id);
  }

  try {
    challenges = yield Challenge.find();
    console.log(challenges);
  } catch(err) {
    console.log('Error getting users *: ' + err);
  }
  console.log(challenges);

  let submissionsArr = populateData.submissions;
  for (let i = 0; i < submissionsArr.length; i++) {
    let id = challenges[i]._id;
    let authorId = challenges[i].creatorUserId;
    yield createSubmissionDocument(submissionsArr[i], authorId, id);
  }
};
