'use strict'
const passport = require('koa-passport');
const axios = require("../lib/axios");
const mkdirp = require("mkdirp");  //  make dirs

const User = require('../models').models.User;
const Submission = require('../models').models.Submission;

exports.postSubmission = function* (err, next) {
  let ctx = this;
  let body = this.request.body;
  yield passport.authenticate( 'bearer', {session:false},
    function *(err, user) {
      if (user) {

        //  creat authorId dir
        const dirPath = '/Users/iansalt/redearthbluesky/challenges-backend/static/videos';
        let dir = dirPath + '/' + user._id;
        mkdirp(dir, function (err) {
          if (err) console.log('Make directory error*: ' + err);
          else console.log('Pow!');
        });
        //  END ******** create authorId dir

        let authorId = user._id;
        let subDoc = {
          authorId: authorId,
          challengedUsers: [
            {
              userId: body.challengedUsers[0].userId,
              status: body.challengedUsers[0].status,
              submissionId: body.challengedUsers[0].submissionId || 'pending'
            },
            {
              userId: body.challengedUsers[1].userId,
              status: body.challengedUsers[1].status,
              submissionId: body.challengedUsers[1].submissionId || 'pending'
            },
            {
              userId: body.challengedUsers[2].userId,
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
  console.log(id);
  try {
    const submission = yield Submission.findOne({challengeTypeId:id})
    .populate('authorId');
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
        console.log(user._id);
        try {
          let submissions = yield Submission.find({authorId:user._id})
            .populate('authorId');
          console.log(submissions);
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
      .populate('authorId');        // return only one
    ctx.body = submissions;
  } catch (err) {
    ctx.status = 401;
    ctx.body = 'Some kind of error*: ' + err;
  }
};

exports.getFeed = function* (next) {
  //  get an array of friend's submissions
};
