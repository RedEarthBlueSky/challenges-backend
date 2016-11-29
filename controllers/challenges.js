'use strict';

const Challenge = require('../models').models.Challenge;

const axios = require("../lib/axios");

exports.getChallenges = function* (next) {
  this.type = 'json';
  try {
    const challenges = yield Challenge.find();
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

exports.postChallenge = function* (next) {
  const that = this.request.body;
};

exports.mostPopularChallenge = function* (next) {

};
