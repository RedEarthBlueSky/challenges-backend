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
          challengedUser1: {
            userId: body.challengedUsers[0].userId,
            status: body.challengedUsers[0].status,
            submissionId: body.challengedUsers[0].submissionId || 'pending'
          },
          challengedUser2:  {
            userId: body.challengedUsers[1].userId,
            status: body.challengedUsers[1].status,
            submissionId: body.challengedUsers[1].submissionId || 'pending'
          },
          challengedUser3:  {
            userId: body.challengedUsers[2].userId,
            status: body.challengedUsers[2].status,
            submissionId: body.challengedUsers[2].submissionId || 'pending'
          },
          created_at: body.created_at,
          challengeTypeId: body.challengeTypeId,
          comment: body.comment,
          videoURL: body.videoURL,
          captureURL: body.captureURL
        };
        let newSubmission = new Submission(subDoc);
        yield newSubmission.save();
        try {
          const submission = yield Submission.findOne({authorId:authorId});
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
        ctx.status = '401';
        ctx.body = 'Cannot find user, error*: ' + err;
      }
  });
};

exports.getFeed = function* (next) {
  //  get an array of friend's submissions
};

exports.getSpecificSubmission = function* (next) {

};

exports.getSelfSubmissions = function* (next) {

};
