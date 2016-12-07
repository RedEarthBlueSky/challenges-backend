'use-strict';

const passport = require('koa-passport');
const uuid = require('uuid');

const User = require('../models').models.User;
const userProfileInfo = require('./data.json');

let userDocument = {
  fbToken: '',
  authToken: '',
  profileInfo: {
    fbId: '',
    firstName: '',
    lastName: '',
    picture: '',  //  S3 URL
    email: ''
  }
};

let createUserDocument = (data) => {
  userDocument.fbToken = uuid.v4();
  userDocument.authToken = uuid.v4();
  userDocument.profileInfo.fbId = "" + (Math.floor(Math.random() * 900000) + 100000);
  userDocument.profileInfo.firstName = data.firstName;
  userDocument.profileInfo.lastName = data.lastName;
  userDocument.profileInfo.picture = data.picture;
  userDocument.profileInfo.email = data.email;
  let newUser = new User(userDocument);
  console.log(newUser);
  newUser.save();
  console.log('**************************');
  console.log('**************************');
  console.log('New user has been created!');
};

exports.populateDb = function* (next) {
  let profileInfoArr = userProfileInfo.profileInfo;
  for (let i = 0; i < profileInfoArr.length; i++) {
    createUserDocument(profileInfoArr[i]);
  }
};
