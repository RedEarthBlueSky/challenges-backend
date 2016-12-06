'use strict'
const passport = require('koa-passport');
const parse = require('co-busboy');
const fs = require('fs');
const uuid = require('uuid');

const User = require('../models').models.User;
const Submission = require('../models').models.Submission;
const s3 = require('./s3.js');

exports.postSubmission = function* (err, next) {
  let ctx = this;
  yield passport.authenticate( 'bearer', {session:false},
    function *(err, user) {
      if (user) {
        let authorId = user._id;
        let parts = parse(ctx);
        let fileName = uuid.v4();
        let part;
        let noFileBody = {};
        while (part = yield parts) {
          if (part.length) {
            noFileBody[part[0]]=part[1]
          } else {
            fileName = part.fileName;
            part.pipe(fs.createWriteStream('/tmp/' + part.filename));
          }
        }

        if (noFileBody.fileName) fileName = noFileBody.fileName;

        if (noFileBody.challengedUsers) noFileBody.challengedUsers = JSON.parse(noFileBody.challengedUsers);

        let subDoc = {
          authorId: authorId,
          challengedUsers: [
            {
              name: noFileBody.challengedUsers[0].name,
              picture: noFileBody.challengedUsers[0].picture,
              status: noFileBody.challengedUsers[0].status || 'pending',
              submissionId: noFileBody.challengedUsers[0].submissionId || 'pending'
            },
            {
              name: noFileBody.challengedUsers[1].name,
              picture: noFileBody.challengedUsers[1].picture,
              status: noFileBody.challengedUsers[1].status || 'pending',
              submissionId: noFileBody.challengedUsers[1].submissionId || 'pending'
            },
            {
              name: noFileBody.challengedUsers[2].name,
              picture: noFileBody.challengedUsers[2].picture,
              status: noFileBody.challengedUsers[2].status || 'pending',
              submissionId: noFileBody.challengedUsers[2].submissionId || 'pending'
            }
          ],
          challengeTypeId: noFileBody.challengeTypeId,
          comment: noFileBody.comment || '',
          videoURL: '',
          captureURL: ''
        };


        let videoURL = yield s3.uploadFile(fileName,authorId);

        subDoc.videoURL = videoURL;

        let newSubmission = new Submission(subDoc);
        let mySub = yield newSubmission.save();
        try {
          let submission = yield Submission.findOne({_id: mySub._id});
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
            .populate('challengeTypeId');
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
