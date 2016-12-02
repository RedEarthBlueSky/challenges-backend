'use strict'
const passport = require('koa-passport');
const axios = require("../lib/axios");

const User = require('../models').models.User;
const Submission = require('../models').models.Submission;

exports.postSubmission = function* (err, next) {
  let ctx = this;
  let body = this.request.body;
  yield passport.authenticate( 'bearer', {session:false},
    function *(err, user) {
      if (user) {
        let authorId = user._id;
        let subDoc = {
          authorId: authorId,
          challengedUsers: [
            {
              userId: body.challengedUsers[0].userId,
              name: body.challengedUsers[0].name,
              picture: body.challengedUsers[0].picture,
              status: body.challengedUsers[0].status,
              submissionId: body.challengedUsers[0].submissionId || 'pending'
            },
            {
              userId: body.challengedUsers[1].userId,
              name: body.challengedUsers[1].name,
              picture: body.challengedUsers[1].picture,
              status: body.challengedUsers[1].status,
              submissionId: body.challengedUsers[1].submissionId || 'pending'
            },
            {
              userId: body.challengedUsers[2].userId,
              name: body.challengedUsers[2].name,
              picture: body.challengedUsers[2].picture,
              status: body.challengedUsers[2].status,
              submissionId: body.challengedUsers[2].submissionId || 'pending'
            },
          ],
          created_at: body.created_at,
          challengeTypeId: body.challengeTypeId,
          comment: body.comment,
          videoURL: body.videoURL,
          captureURL: body.captureURL
        };

        let newSubmission = new Submission(subDoc);
        yield newSubmission.save();
        try {
          let submission = yield Submission.findOne({authorId:authorId});
          if (submission._id) {
            ctx.status = 200;
            ctx.body = submission;
          }
        } catch (err) {
          ctx.status = 401;
          ctx.body = err;
        }
      }
      else {
        ctx.status = 401;
        ctx.body = 'Cannot find user, error*: ' + err;
      }
  });
};

exports.getSpecificSubmission = function* (next) {
  this.type = 'json';
  const id = this.params.id;
  try {
    const submission = yield Submission.findOne({challengeTypeId:id})
      .populate('authorId')
      .populate('challengeTypeId')
      .populate('challengedUsers[0].userId')
      .populate('challengedUsers[1].userId')
      .populate('challengedUsers[2].userId');
    this.body = submission;
  } catch(err) {
    this.status = 401;
    this.body = err;
  }
};

exports.getSelfSubmissions = function* (next) {
  let ctx = this;
  yield passport.authenticate( 'bearer', {session:false},
    function *(err, user) {
      if (user) {
        try {
          let submissions = yield Submission.find({authorId:user._id})
            .populate('authorId')
            .populate('challengeTypeId')
            .populate('challengedUsers[0].userId')
            .populate('challengedUsers[1].userId')
            .populate('challengedUsers[2].userId');
          ctx.status = 201;
          ctx.body = submissions;

        } catch(err) {
          ctx.status = 401;
          ctx.body = 'Error, baby, error*: ' + err;
        }
      }
      else {
        ctx.status = 401;
        ctx.body = 'Error*:  Token error*: ' + err;
      }
  });
};

exports.getLatestSubmissions = function* (next) {
  this.type = 'json';
  let ctx = this;
  let challengeTypeId = this.params.id;
  try {
    //  further query parameters according to date created
    let submissions = yield Submission.find({challengeTypeId: challengeTypeId})
      .sort({_id:-1})  //  order newest to oldest
      .limit(1)
      .populate('authorId')
      .populate('challengeTypeId')
      .populate('challengedUsers[0].userId')
      .populate('challengedUsers[1].userId')
      .populate('challengedUsers[2].userId'); // return only one
    ctx.body = submissions;
  } catch (err) {
    ctx.status = 401;
    ctx.body = 'Some kind of error*: ' + err;
  }
};

exports.getFeed = function* (next) {
  //  get an array of friend's submissions
};
