'use strict';

const passport = require('koa-passport');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const parse = require('co-body');

const loadConfig = require('./load-config');
let fbOptions = loadConfig.DEFAULTS;

const FB = require('fb');
let promise = FB;
const fb = FB.extend({appId: fbOptions.appId, appSecret: fbOptions.appSecret});

const User = require('../models').models.User;

let serializeUser = (user) => {
  return {
    fbToken: user.fbToken,
    authToken: user.authToken,
    fbId:user.profileInfo.fbId,
    firstName:user.profileInfo.firstName,
    lastName:user.profileInfo.lastName,
    picture:user.profileInfo.picture,
    email:user.profileInfo.email
  }
}

exports.login = function* (next) {
  let ctx = this;
  let fbToken = this.request.body.fbToken;
  fb.setAccessToken(fbToken);

  let p1 = new Promise(function(resolve, reject){
    fb.api(fbOptions.apiURL, function(res){
      if (!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        reject(res.error);
      }
      resolve(res);
    });
  });

  let fbData = yield p1
    .then((data) => {
      return data;
    })
    .catch((err) => {
      ctx.status = 401;
      ctx.body = { error: "Token not valid."};
      console.log('An error has returned: ' + err);
  });

  yield User.findOne({ 'profileInfo.fbId': fbData.id })
    .then(( user ) => {
      if ( user !== null ) {
        ctx.status = 200;
        ctx.body = serializeUser(user);
      }
      else {
        console.log('User is not in the database we need to create...');
        let newToken = uuid.v4();
        let newDocument = {
          fbToken:fbToken,                      // fbToken
          authToken:newToken,
          profileInfo: {
            fbId: fbData.id,                    // fbData.id
            firstName: fbData.first_name,       // fbData.first_name
            lastName: fbData.last_name,         // fbData.last_name
            picture: fbData.picture.data.url,   // fbData.picture.data.url
            email: fbData.email                 // fbData.email
          }
        }
        let newUser = new User(newDocument);
        newUser.save();
        console.log('New user has been created!');
        ctx.status = 200;
        ctx.body = serializeUser(newUser);
      }
    })
    .catch((err) => {
      console.log('Error creating or accessing user*:' + err);
    });
};

exports.checkUser = function* (next) {
  let ctx = this;
  let authToken = this.request.header.authtoken;

  yield User.findOne({ 'authToken': authToken })
    .then((user) => {
      if (user !== null) {
        ctx.status = 200;
        ctx.body = serializeUser(user);
      }
    })
    .catch((err) => {
      console.log('Error checking user*:' + err);
  });
};

let createUser = function* (next) {

};

exports.delUser = function* (next) {

};

exports.notifications = function* (next) {

};
