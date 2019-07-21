# `@foo-software/s3-directory-sync-cli`

> A CLI to sync a local directory with an AWS S3 bucket. Example usage could involve an automated deployment of a serverless web app. This command essentially uploads a folder to a bucket.

## Install

> For use within a project:
```bash
npm install @foo-software/s3-directory-sync-cli --save-dev
```

> For global use:
```bash
npm install @foo-software/s3-directory-sync-cli -g
```

## Usage

> Command line:
```bash
s3-directory-sync \
  --S3_DIRECTORY_SYNC_ACCESS_KEY_ID abcdef \
  --S3_DIRECTORY_SYNC_BUCKET ghijkl \
  --S3_DIRECTORY_SYNC_LOCAL_DIRECTORY build \
  --S3_DIRECTORY_SYNC_SECRET_ACCESS_KEY mnopqr \
  /
```

> In a project `package.json` (assuming environment variables like `S3_DIRECTORY_SYNC_ACCESS_KEY_ID=abcdef`):
```json
{
  "scripts": {
    "deploy": "s3-directory-sync"
  }
}
```

## Parameters

Parameters can either be passed in the command line as arguments or as environment variables.

<table>
  <tr>
    <th>Name</th>
    <th>Description</th>
    <th>Default</th>
  </tr>
  <tr>
    <td><code>S3_DIRECTORY_SYNC_ACCESS_KEY_ID</code></td>
    <td>The AWS <code>accessKeyId</code> for an S3 bucket.</td>
    <td><code>--</code></td>
  </tr>
  <tr>
    <td><code>S3_DIRECTORY_SYNC_BUCKET</code></td>
    <td>The AWS <code>Bucket</code> for an S3 bucket.</td>
    <td><code>--</code></td>
  </tr>
  <tr>
    <td><code>S3_DIRECTORY_SYNC_SECRET_ACCESS_KEY</code></td>
    <td>The AWS <code>secretAccessKey</code> for an S3 bucket.</td>
    <td><code>--</code></td>
  </tr>
  <tr>
    <td><code>S3_DIRECTORY_SYNC_LOCAL_DIRECTORY</code></td>
    <td>The local directory to sync (upload), relative to the directory of the command execution.</td>
    <td><code>--</code></td>
  </tr>
  <tr>
    <td><code>S3_DIRECTORY_SYNC_REMOTE_DIRECTORY</code></td>
    <td>The directory of an S3 bucket to sync from a local directory. An empty string signifies the root.</td>
    <td><code>''</code></td>
  </tr>
  <tr>
    <td><code>S3_DIRECTORY_SYNC_ACL</code></td>
    <td>The <a href="https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html">Access Control Policy</a> as documented.</td>
    <td><code>public-read</code></td>
  </tr>
  <tr>
    <td><code>S3_DIRECTORY_SYNC_STRICT</code></td>
    <td>Set to <code>true</code> if remote files that don't exist locally should be removed.</td>
    <td><code>false</code></td>
  </tr>
</table>

## Credits

> <img src="https://s3.amazonaws.com/foo.software/images/logo-200x200.png" width="100" height="100" align="left" /> This package was brought to you by [Foo - a website performance monitoring tool](https://www.foo.software). Create a **free account** with standard performance testing. Automatic website performance testing, uptime checks, charts showing performance metrics by day, month, and year. Foo also provides real time notifications when performance and uptime notifications when changes are detected. Users can integrate email, Slack and PagerDuty notifications.
