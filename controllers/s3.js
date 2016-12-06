'use strict'
const passport = require('koa-passport');
const s3config = require('../AwsConfig.json');
const AWS = require('aws-sdk');
const parse = require('co-busboy');
const fs = require('fs');

AWS.config = new AWS.Config();
AWS.config.accessKeyId = s3config.accessKeyId;
AWS.config.secretAccessKey = s3config.secretAccessKey;
AWS.config.region = s3config.region;

const BUCKET = s3config.Bucket;

const awsS3Client = new AWS.S3();
const s3 = require('s3');

let client = s3.createClient({
  s3Client: awsS3Client,
  maxAsyncS3: 20,     // this is the default
  s3RetryCount: 3,    // this is the default
  s3RetryDelay: 1000, // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
});

//  work around to stop files hanging on upload
client.s3.addExpect100Continue = function () {};

exports.uploadFile = function* (err, next) {
  let ctx = this;
  let authorId;
  yield passport.authenticate('bearer', {session:false},
    function *(err, user) {
      if (user) {
        ctx.status = 200;
        authorId = user._id;
        ctx.body = authorId;
      } else {
        ctx.status = 401;
        ctx.body = 'Cannot find user *: ' + err;
      }
    });

  console.log(!this.request.is('multipart/*'));
  let parts = parse(this);
  let fileName;
  console.log(parts);
  let part;
  while (part = yield parts) {
    if (part.length) {
      //  arrays are busboy fields
      console.log('key *: ', part[0]);
      console.log('value *: ', part[1]);
      // if (part[0]==='fileName') fileName = part[1];
    } else {
      //  otherwise it is a stream
      console.log('Handle the stream here');
      fileName = part.fileName;
      //  need to write the file name as well as the path here
      part.pipe(fs.createWriteStream('/tmp/' + part.filename));
    }
    console.log('And we are done parsing the form');
  }
  const params = {
    localFile: '/tmp/' + fileName,
    s3BucketEndpoint: true,
    contentType: 'video/mp4',
    s3Params: {
      Bucket: BUCKET,
      //  videos/filename KEY for VALUE localFile parameter (file value)
      Key: 'videos/' + authorId + '/' + fileName,  //  Object KEY
      Body: fileName,    //  Object DATA
      ACL:'public-read-write'
    }
  };

  let uploader = client.uploadFile(params);

  uploader.on('error', function (err) {
    console.error("unable to upload:", err.stack);
  });

  uploader.on('progress', function () {
    console.log("progress", uploader.progressMd5Amount,
        uploader.progressAmount, uploader.progressTotal);
  });

  uploader.on('end', function () {
    console.log('done uploading'); //  include URL to the file upload
  });
};
