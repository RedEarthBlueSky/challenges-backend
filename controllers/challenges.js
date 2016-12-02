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
        created_at: + new Date(),
        title:ctx.request.body.title,
        description:ctx.request.body.description,
        totalChallenged: ctx.request.body.totalChallenged || "0",
        totalSubmitted: ctx.request.body.totalSubmitted || "0",
        imageURL:ctx.request.body.imageURL || "some placeholder image here"
      };
      let newChallenge = new Challenge(challengeDocument);
      yield newChallenge.save();
      console.log(newChallenge.challengeId);
      try {
        let challenge = yield Challenge.findOne({challengeId:newChallenge.challengeId});
        if (challenge.challengeId) {
          ctx.status = 200;
          ctx.body = challenge;
        }
      } catch (err) {
        ctx.status = 401;
        ctx.body = err;
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
    const challenges = yield Challenge.find()
      .populate('creatorUserId');
      this.status = 200;
      this.body = challenges;

  } catch (err) {
    this.status = 401;
    this.body = err;
  }
};

exports.getSpecificChallenge = function* (next) {
  this.type = 'json';
  const id = this.params.id;
  try {
    const challenge = yield Challenge.findOne({_id:id})
      .populate('creatorUserId');
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
