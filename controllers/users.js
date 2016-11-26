'use strict';

const passport = require('koa-passport');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const parse = require('co-body');

const accessToken = 'EAAYCbbWRYZAYBAGoN1ZAnCDXd4q2F1pMB2BBfmQqSZBwZAprJIpWH18FFUxiU4MibegafgfrmXKf5Xwhz9XXZC6ttAuoxV1cNgaUjqsmvt5GZBVRrtEE1XZBubJZCWLl8j7WKWj68zDThLIW1hCBMlrLFV4BbZAAcKldr1bsExk65xI4UphAcNOBTVa2fSzs3EdKCbvPZB3jZBZA1VWTnTt8DnPt';
const appSecret = 'd3643b4fd48d1eae846420a7afe2cc17';
const appId = 'd3643b4fd48d1eae846420a7afe2cc17';
const apiURL = 'me?fields=id,first_name,last_name,picture';

const FB = require('fb');
let promise = FB
let fb = FB.extend({appId, appSecret});
fb.setAccessToken(accessToken);

const User = require('../models').models.User;

exports.login = function* (next) {
  let ctx = this;
  let p1 = new Promise(function(resolve, reject){
    fb.api(apiURL, function(res){
      if (!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        reject(res.error);
      }
      resolve(res);
    });
  });
  yield p1
    .then((data) => {
      console.log(data);
      ctx.status = 200;
      ctx.body = data;
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.createUser = function* (next) {

};

exports.checkUser = function* (next) {

};

exports.delUser = function* (next) {

};

exports.notifications = function* (next) {

};
