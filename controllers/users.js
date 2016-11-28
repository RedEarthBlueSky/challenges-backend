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

  fb.setAccessToken(this.request.body.fbToken);

  let p1 = new Promise(function(resolve, reject){
    fb.api(fbOptions.apiURL, function(res){
      if (!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        reject(res.error);
      }
      resolve(res);
    });
  });
  yield p1
    .then((data) => {
      //  does this user already exist
      //  if not create User
      //  respond user data from database
      let newToken = uuid.v4();
      ctx.status = 200;
      ctx.body =  {
                  fbId: data.id,
                  firstName: data.first_name,
                  lastName: data.last_name,
                  picture: data.picture.data.url,
                  email:data.email,
                  authToken:newToken
                  };
    })
    .catch((err) => {
      console.log('An error has returned: ' + err);
    });
};

let checkUser = function* (next, id, ctx) {
  User.findOne({fbId: data.id}, function (err, id) {
    if (error) {
      colsole.log('MongoDB Error: ' + err);
    }
    if (!id) {
      console.log("No item found, creating tracksTable item");
      //  call create user here
    } else {
      console.log("Found a user " + User.fbId);
    }
  });
};

let createUser = function* (next) {

};

exports.delUser = function* (next) {

};

exports.notifications = function* (next) {

};
