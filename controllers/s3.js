'use strict'
const passport = require('koa-passport');


// AWS.config.loadFromPath('./AwsConfig.json');

const s3config = require('../AwsConfig.json');
const AWS = require('aws-sdk');
const parse = require('co-busboy');
const fs = require('fs');

AWS.config = new AWS.Config();
AWS.config.accessKeyId = s3config.accessKeyId;
AWS.config.secretAccessKey = s3config.secretAccessKey;
AWS.config.region = s3config.region;

const awsS3Client = new AWS.S3();
const s3 = require('s3');

const BUCKET = 'codeworks-challenges';

let client = s3.createClient({
  s3Client: awsS3Client,
  maxAsyncS3: 20,     // this is the default
  s3RetryCount: 3,    // this is the default
  s3RetryDelay: 1000, // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
});

let authorId = '58401311c780b02d99fc9bb7';
let videoName = 'cinamon-challenge.mp4';
const params = {
  localFile: '/Users/iansalt/Desktop/videos/' + videoName,
  s3BucketEndpoint: true,
  contentType: 'video/mp4',
  s3Params: {
    Bucket: BUCKET,
    //  videos/filename KEY for VALUE localFile parameter (file value)
    Key: 'videos/' + authorId + '/' + videoName,  //  Object KEY
    Body: videoName,    //  Object DATA
    ACL:'public-read-write'
  }
};

//  work around to stop files hanging on upload
client.s3.addExpect100Continue = function () {};

exports.uploadFile = function* (err, next) {

  console.log(!this.request.is('multipart/*'));

  let parts = parse(this);
  let part;
  while (part = yield parts) {
    if (part.length) {
      //  arrays are busboy fields
      console.log('key *: ', part[0]);
      console.log('value *: ', part[1]);
    } else {
      //  otherwise it is a stream
      console.log('Handle the stream here');
      part.pipe(fs.createWriteStream('/Users/iansalt/redearthbluesky/challenges-backend/static/videos/file.mp4'));
    }
    console.log('And we are done parsing the form');
  }


  // yield passport.authenticate('bearer', {session:false},
  //   function *(err, user) {
  //     if (user) {
  //       ctx.status = 200;
  //       ctx.body = user;
  //     } else {
  //       ctx.status = 401;
  //       ctx.body = 'Cannot find user *: ' + err;
  //     }
  //   });

  // //  creat authorId dir
  // const dirPath = '/Users/iansalt/redearthbluesky/challenges-backend/static/videos';
  // let dir = dirPath + '/' + user._id;
  // yield mkdirp(dir, function (err) {
  //   if (err) console.log('Make directory error*: ' + err);
  //   else console.log('Pow!');
  // });
  // //  END ******** create authorId dir
  //
  // let uploader = client.uploadFile(params);
  //
  // uploader.on('error', function (err) {
  //   console.error("unable to upload:", err.stack);
  // });
  //
  // uploader.on('progress', function () {
  //   console.log("progress", uploader.progressMd5Amount,
  //       uploader.progressAmount, uploader.progressTotal);
  // });
  //
  // uploader.on('end', function () {
  //   console.log('done uploading'); //  include URL to the file upload
  // });
};
