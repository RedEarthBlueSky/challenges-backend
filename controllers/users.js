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
    console.log('An error has returned: ' + err);
  });
  console.log(fbData);
  yield User.findOne({ 'profileInfo.fbId': fbData.id })
    .then((user)=>{
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
    })
    .catch((err) => {console.log(err);});
};

let checkUser = function* (next, id, ctx) {

};

let createUser = function* (next) {

};

exports.delUser = function* (next) {

};

exports.notifications = function* (next) {

};
