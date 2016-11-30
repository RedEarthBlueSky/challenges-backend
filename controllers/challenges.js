'use strict';

const passport = require('koa-passport');
const uuid = require('uuid');
const Challenge = require('../models').models.Challenge;
const User = require('../models').models.User;

const axios = require("../lib/axios");

exports.postChallenge = function* (next) {
  let ctx = this;
  yield passport.authenticate('bearer', {session:false},
  function *(err, user) {
    if (user) {
      let challengeId = uuid.v4();
      let challengeDocument = {
        challengeId: challengeId,
        creatorUserId: user._id,
        creatorName: user.profileInfo.firstName + ' ' + user.profileInfo.lastName,
        created_at: + new Date(),
        title:ctx.request.body.title,
        comment:"Some comments not sure where from",
        description:ctx.request.body.description,
        totalChallenged: "0",
        totalSubmitted: "0",
        picture:ctx.request.body.imageURL
      };
      try {
        let newChallenge = new Challenge(challengeDocument);
        let temp = yield newChallenge.save();
        ctx.status = 200;
        ctx.body = temp;
      } catch(err) {
        console.log(err);
      }
    }
    else {
      ctx.status = 401;
      ctx.body = { error:  'Wrong token.'};
    }
  });
};

exports.getChallenges = function* (next) {
  this.type = 'json';
  try {
    const challenges = yield Challenge.find();
      this.status = 200;
      this.body = {
        challenges: challenges
      };

  } catch (err) {
    this.status = 401;
    this.body = err;
  }
};

exports.getSpecificChallenge = function* (next) {
  this.type = 'json';
  const id = this.params.id;
  try {
    const challenge = yield Challenge.findOne({_id:id});
    if (challenge.id) {
      this.status = 200;
      this.body = challenge;
    }
  } catch (err) {
    this.status = 401;
    this.body = err;
  }
};

exports.mostPopularChallenge = function* (next) {

};
