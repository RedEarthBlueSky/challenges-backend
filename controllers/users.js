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

exports.login = function* (next) {
  let ctx = this;
  console.log(this.request.body);
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
    .then((user)=>{
      if (user !== null) {
        ctx.status = 200;
        ctx.body = {
          fbToken: user.fbToken,
          authToken: user.authToken,
          fbId:user.profileInfo.fbId,
          firstName:user.profileInfo.firstName,
          lastName:user.profileInfo.lastName,
          picture:user.profileInfo.picture,
          email:user.profileInfo.email
        };
      }
    }).then((user)=>{
      console.log(user);
      console.log('User is not in the database we need to create...');
      let newToken = uuid.v4();
      let newDocument = {
        fbToken:'1234',     // fbToken
        authToken:newToken,
        profileInfo: {
          fbId: fbData.id,            // fbData.id
          firstName:'Percy',       // fbData.first_name
          lastName:'Jackson',        // fbData.last_name
          picture:'Lightening Thief Image',         // fbData.picture.data.url
          email:'zues@pj.com'           // fbData.email
        }
      }

      //  convert to a promise
      let newUser = new User(newDocument);
      newUser.save();
      console.log('New user has been created!');
      ctx.status = 200;
      ctx.body = {
        fbToken: newUser.fbToken,
        authToken: newUser.authToken,
        fbId:newUser.profileInfo.fbId,
        firstName:newUser.profileInfo.firstName,
        lastName:newUser.profileInfo.lastName,
        picture:newUser.profileInfo.picture,
        email:newUser.profileInfo.email
      };
    })
    .catch((err) => {
      console.log('Error creating or accessing user*:' + err);
    });
};

let checkUser = function (next) {

};

let createUser = function* (next) {

};

exports.delUser = function* (next) {

};

exports.notifications = function* (next) {

};
