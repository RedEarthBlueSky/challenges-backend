'use strict'
const passport = require('koa-passport');
const s3config = require('../AwsConfig.json');
const AWS = require('aws-sdk');

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

exports.uploadFile = function* (fileName, authorId) {

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

  return `https://${s3config.Bucket}.s3.amazonaws.com/videos/${authorId}/${fileName}`;

};
