#! /usr/bin/env node
import AWS from 'aws-sdk';
import fs from 'fs';
import mime from 'mime-types';
import path from 'path';
import ProgressBar from 'cli-progress-bar';
import { name, version } from '../../package.json';
import { convertOptionsFromArguments } from '../helpers/arguments';
import deleteObjects from '../helpers/deleteObjects';
import listObjects from '../helpers/listObjects';
import upload from '../helpers/upload';
import getFiles from '../helpers/getFiles';

console.log(`${name}@${version}: sync starting...`);

// default options from environment variables
const defaultOptions = {
  S3_DIRECTORY_SYNC_ACCESS_KEY_ID: process.env.S3_DIRECTORY_SYNC_ACCESS_KEY_ID,
  S3_DIRECTORY_SYNC_ACL: process.env.S3_DIRECTORY_SYNC_ACL || 'public-read',
  S3_DIRECTORY_SYNC_BUCKET: process.env.S3_DIRECTORY_SYNC_BUCKET,
  S3_DIRECTORY_SYNC_DERIVE_CONTENT_TYPE:
    process.env.S3_DIRECTORY_SYNC_DERIVE_CONTENT_TYPE === 'true',
  S3_DIRECTORY_SYNC_LOCAL_DIRECTORY:
    process.env.S3_DIRECTORY_SYNC_LOCAL_DIRECTORY,
  S3_DIRECTORY_SYNC_PROGRESS: process.env.S3_DIRECTORY_SYNC_PROGRESS === 'true',
  S3_DIRECTORY_SYNC_REMOTE_DIRECTORY:
    process.env.S3_DIRECTORY_SYNC_REMOTE_DIRECTORY || '',
  S3_DIRECTORY_SYNC_REMOVE_HTML_EXTENSIONS:
    process.env.S3_DIRECTORY_SYNC_REMOVE_HTML_EXTENSIONS === 'true',
  S3_DIRECTORY_SYNC_REMOVE_HTML_EXTENSIONS_EXCLUDE:
    process.env.S3_DIRECTORY_SYNC_REMOVE_HTML_EXTENSIONS_EXCLUDE,
  S3_DIRECTORY_SYNC_SECRET_ACCESS_KEY:
    process.env.S3_DIRECTORY_SYNC_SECRET_ACCESS_KEY,
  S3_DIRECTORY_SYNC_STRICT: process.env.S3_DIRECTORY_SYNC_STRICT === 'true'
};

// override options with any that are passed in as arguments
const options = convertOptionsFromArguments(defaultOptions);

if (
  !options.S3_DIRECTORY_SYNC_ACCESS_KEY_ID ||
  !options.S3_DIRECTORY_SYNC_BUCKET ||
  !options.S3_DIRECTORY_SYNC_LOCAL_DIRECTORY ||
  !options.S3_DIRECTORY_SYNC_SECRET_ACCESS_KEY
) {
  throw Error(
    'missing required option/s: ' +
      'S3_DIRECTORY_SYNC_ACCESS_KEY_ID, ' +
      'S3_DIRECTORY_SYNC_BUCKET, ' +
      'S3_DIRECTORY_SYNC_LOCAL_DIRECTORY, ' +
      'S3_DIRECTORY_SYNC_SECRET_ACCESS_KEY'
  );
}

// create the AWS S3 client
const s3 = new AWS.S3({
  accessKeyId: options.S3_DIRECTORY_SYNC_ACCESS_KEY_ID,
  secretAccessKey: options.S3_DIRECTORY_SYNC_SECRET_ACCESS_KEY,
  signatureVersion: 'v4'
});

// display a progress bar
const bar = !options.S3_DIRECTORY_SYNC_PROGRESS ? undefined : new ProgressBar();

const rootFolder = path.resolve();

(async () => {
  const filesToUpload = await getFiles(
    path.resolve(rootFolder, options.S3_DIRECTORY_SYNC_LOCAL_DIRECTORY)
  );

  if (!filesToUpload.length) {
    throw Error('no files found. please revisit the configuration.');
  }

  let localVsRemoteFileDiff;

  // if we need to delete files that don't exist locally but do exist remotely...
  if (options.S3_DIRECTORY_SYNC_STRICT) {
    const existingFileObjects = await listObjects({
      params: {
        Bucket: options.S3_DIRECTORY_SYNC_BUCKET
      },
      s3
    });
    const existingFilesOnS3 = (
      (existingFileObjects && existingFileObjects.Contents) ||
      []
    ).map(({ Key }) => Key);

    if (existingFilesOnS3.length) {
      // convert existing files to a set to easily remove items. this way we'll have the
      // difference in the end of it all
      localVsRemoteFileDiff = new Set(existingFilesOnS3);
    }
  }

  for (const [index, file] of filesToUpload.entries()) {
    let Key = file.replace(
      `${rootFolder}/${options.S3_DIRECTORY_SYNC_LOCAL_DIRECTORY}/`,
      !options.S3_DIRECTORY_SYNC_REMOTE_DIRECTORY
        ? ''
        : `${options.S3_DIRECTORY_SYNC_REMOTE_DIRECTORY}/`
    );

    if (
      options.S3_DIRECTORY_SYNC_REMOVE_HTML_EXTENSIONS &&
      Key.includes('.html')
    ) {
      let shouldRemoveExtension = true;
      if (options.S3_DIRECTORY_SYNC_REMOVE_HTML_EXTENSIONS_EXCLUDE) {
        const excludes = options.S3_DIRECTORY_SYNC_REMOVE_HTML_EXTENSIONS_EXCLUDE.split(
          ','
        );
        for (const excludeFile of excludes) {
          if (excludeFile === Key) {
            shouldRemoveExtension = false;
            break;
          }
        }
      }
      if (shouldRemoveExtension) {
        Key = Key.replace('.html', '');
      }
    }

    const params = {
      ACL: options.S3_DIRECTORY_SYNC_ACL,
      Bucket: options.S3_DIRECTORY_SYNC_BUCKET,
      Body: fs.readFileSync(file),
      Key
    };

    if (options.S3_DIRECTORY_SYNC_DERIVE_CONTENT_TYPE) {
      const contentType = mime.lookup(file);
      if (contentType) {
        params.ContentType = contentType;
      }
    }

    await upload({
      params,
      s3
    });

    if (localVsRemoteFileDiff) {
      localVsRemoteFileDiff.delete(Key);
    }

    const percentCompleted = (index + 1) / filesToUpload.length;

    if (bar && typeof percentCompleted === 'number') {
      bar.show('uploaded', percentCompleted);
      bar.pulse('total');
    }
  }

  if (bar) {
    bar.hide();
  }

  // if we have a difference of files between the remote bucket
  // and local file directory
  if (localVsRemoteFileDiff && localVsRemoteFileDiff.size) {
    const localVsRemoteFileDiffArray = [...localVsRemoteFileDiff];
    await deleteObjects({
      params: {
        Bucket: options.S3_DIRECTORY_SYNC_BUCKET,
        Delete: {
          Objects: localVsRemoteFileDiffArray.map(Key => ({ Key })),
          Quiet: false
        }
      },
      s3
    });
    console.log(
      `S3_DIRECTORY_SYNC_STRICT is true. the following remote files were removed:`,
      localVsRemoteFileDiffArray
    );
  }

  console.log(`${name}: ☀️ 🌴 sync completed`);
  console.log(`${name}: brought to you by Foo (https://www.foo.software)`);
})();
