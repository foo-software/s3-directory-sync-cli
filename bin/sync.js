#! /usr/bin/env node
const s3 = require('s3');
const { convertOptionsFromArguments } = require('../helpers/arguments');

const defaultOptions = {
  S3_DIRECTORY_SYNC_ACCESS_KEY_ID: process.env.S3_DIRECTORY_SYNC_ACCESS_KEY_ID,
  S3_DIRECTORY_SYNC_ACL: process.env.S3_DIRECTORY_SYNC_ACL || 'public-read',
  S3_DIRECTORY_SYNC_BUCKET: process.env.S3_DIRECTORY_SYNC_BUCKET,
  S3_DIRECTORY_SYNC_LOCAL_DIRECTORY: process.env.S3_DIRECTORY_SYNC_LOCAL_DIRECTORY,
  S3_DIRECTORY_SYNC_REMOTE_DIRECTORY: process.env.S3_DIRECTORY_SYNC_REMOTE_DIRECTORY || '',
  S3_DIRECTORY_SYNC_SECRET_ACCESS_KEY: process.env.S3_DIRECTORY_SYNC_SECRET_ACCESS_KEY,
  S3_DIRECTORY_SYNC_STRICT: process.env.S3_DIRECTORY_SYNC_STRICT || false,
};

const options = convertOptionsFromArguments(defaultOptions);

const client = s3.createClient({
  s3Options: {
    accessKeyId: options.S3_DIRECTORY_SYNC_ACCESS_KEY_ID,
    secretAccessKey: options.S3_DIRECTORY_SYNC_SECRET_ACCESS_KEY,
  },
});

const params = {
  localDir: options.S3_DIRECTORY_SYNC_LOCAL_DIRECTORY,
  deleteRemoved: options.S3_DIRECTORY_SYNC_STRICT,
  s3Params: {
    ACL: options.S3_DIRECTORY_SYNC_ACL,
    Bucket: options.S3_DIRECTORY_SYNC_BUCKET,
    Prefix: options.S3_DIRECTORY_SYNC_REMOTE_DIRECTORY,
  },
};

const uploader = client.uploadDir(params);

uploader.on('error', function(err) {
  console.error("unable to sync:", err.stack);
});

uploader.on('progress', function() {
  console.log("progress", uploader.progressAmount, uploader.progressTotal);
});

uploader.on('end', function() {
  console.log("done uploading");
});
