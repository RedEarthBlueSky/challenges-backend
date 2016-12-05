'use strict'
const passport = require('koa-passport');


// AWS.config.loadFromPath('./AwsConfig.json');

const s3config = require('../AwsConfig.json');
const AWS = require('aws-sdk');

AWS.config = new AWS.Config();
AWS.config.accessKeyId = s3config.accessKeyId;
AWS.config.secretAccessKey = s3config.secretAccessKey;
AWS.config.region = s3config.region;

const awsS3Client = new AWS.S3();
const s3 = require('s3');

const BUCKET = 'codeworks-challenges';

const client = s3.createClient({
  s3Client: awsS3Client,
  maxAsyncS3: 20,     // this is the default
  s3RetryCount: 3,    // this is the default
  s3RetryDelay: 1000, // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
});

const params = {
  localFile: '/Users/iansalt/Desktop/AmazonS3.png',
  s3BucketEndpoint: true,
  s3Params: {
    Bucket: BUCKET,
    //  key to be the file URL
    Key:'file URL'
  }
}

exports.uploadVideo = function* (next) {

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
