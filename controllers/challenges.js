'use strict';

const uuid = require('uuid');
const Challenge = require('../models').models.Challenge;
const User = require('../models').models.User;

const axios = require("../lib/axios");

exports.postChallenge = function* (next) {
  const ctx = this;
  let authToken = this.request.header['authorization']; // bearer token
  authToken = authToken.split(' ');
  if (authToken[0] === 'Bearer') authToken = authToken[1];
  let challengeId = uuid.v4();
  console.log(this.request.body.title);

  yield User.findOne({ 'authToken': authToken })
    .then((user)=>{
      if (user !== null) {
        let challengeDocument = {
          challengeId: challengeId,
          creatorUserId: user._id,
          creatorName: user.profileInfo.firstName + ' ' + user.profileInfo.lastName,
          created_at: + new Date(),
          title:this.request.body.title,
          comment:"Some comments not sure where from",
          description:this.request.body.description,
          totalChallenged: "0",
          totalSubmitted: "0",
          picture:this.request.body.imageURL
        };
        console.log(challengeDocument);
        let newChallenge = new Challenge(challengeDocument);
        console.log(newChallenge);
        newChallenge.save();
        console.log('New Challenge has been created!');
        ctx.status = 200;
        // ctx.body = newChallenge;
      }
    })
    .catch((err) => {
      console.log('Error getting user from bearer*:' + err);
    });

  //  Middleware, check there is a bearer token and retrieve user

  //  Get user information from the database

  //  ///////////////////////////////////////
  //  Response 201 format
  // {
  //   *****  Create unique challenge ID
  //   "id": "asdf90w8sifas0f820f",
  //   *****  Get ID of user who created
  //   "creatorUserId": "afsd772298rsuf",
  //   *****  Give create timestamp
  //   "created_at": "2015-08-05T08:40:51.620Z",
  //   *****  Title from body of challenge
  //   "title": "Cinnamon challenge",
  //   *****  Description from body of challenge
  //   "description": "Swallow a teaspoon of cinnamon if you can.",
  //   *****  To be updated at a later date
  //   "totalChallenged": "0",
  //   *****  Count challenges in db and return submitted
  //   "totalSubmited": "0",
  //   *****  Image URL from body of submitted challenge
  //   "imageURL": "http://image.slidesharecdn.com/deadlyviralvideotrends-160309201939/95/deadly-viral-video-trends-16-638.jpg?cb=1457606606",
  //   "popularity":  "Rating system"
  // }
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
