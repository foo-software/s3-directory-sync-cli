#! /usr/bin/env node
const s3 = require('s3');
const ProgressBar = require('cli-progress-bar');
const package = require('../package.json');
const { convertOptionsFromArguments } = require('../helpers/arguments');

console.log(`${package.name}: sync starting...`);

// default options from environment variables
const defaultOptions = {
  S3_DIRECTORY_SYNC_ACCESS_KEY_ID: process.env.S3_DIRECTORY_SYNC_ACCESS_KEY_ID,
  S3_DIRECTORY_SYNC_ACL: process.env.S3_DIRECTORY_SYNC_ACL || 'public-read',
  S3_DIRECTORY_SYNC_BUCKET: process.env.S3_DIRECTORY_SYNC_BUCKET,
  S3_DIRECTORY_SYNC_LOCAL_DIRECTORY: process.env.S3_DIRECTORY_SYNC_LOCAL_DIRECTORY,
  S3_DIRECTORY_SYNC_REMOTE_DIRECTORY: process.env.S3_DIRECTORY_SYNC_REMOTE_DIRECTORY || '',
  S3_DIRECTORY_SYNC_SECRET_ACCESS_KEY: process.env.S3_DIRECTORY_SYNC_SECRET_ACCESS_KEY,
  S3_DIRECTORY_SYNC_STRICT: process.env.S3_DIRECTORY_SYNC_STRICT || false,
};

// override options with any that are passed in as arguments
const options = convertOptionsFromArguments(defaultOptions);

// create the AWS S3 client
const client = s3.createClient({
  s3Options: {
    accessKeyId: options.S3_DIRECTORY_SYNC_ACCESS_KEY_ID,
    secretAccessKey: options.S3_DIRECTORY_SYNC_SECRET_ACCESS_KEY,
  },
});

const uploader = client.uploadDir({
  localDir: options.S3_DIRECTORY_SYNC_LOCAL_DIRECTORY,
  deleteRemoved: options.S3_DIRECTORY_SYNC_STRICT,
  s3Params: {
    ACL: options.S3_DIRECTORY_SYNC_ACL,
    Bucket: options.S3_DIRECTORY_SYNC_BUCKET,
    Prefix: options.S3_DIRECTORY_SYNC_REMOTE_DIRECTORY,
  },
});

uploader.on('error', (error) => {
  throw Error(error);
});

// display a progress bar
const bar = new ProgressBar();

uploader.on('progress', () => {
  const percentCompleted = uploader.progressAmount / uploader.progressTotal;
  if (typeof percentCompleted === 'number') {
    bar.show('current', percentCompleted);
    bar.pulse('total');
  }
});

uploader.on('end', () => {
  bar.hide();
  console.log(`${package.name}: sync completed ☀️ 🌴`);
  console.log(`${package.name}: brought to you by Foo (https://www.foo.software)`);
});
