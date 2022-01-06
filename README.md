## DEPRECATED

**This project has been deprecated and is no longer maintained** in favor of projects like [s3-sync-client](https://github.com/jeanbmar/s3-sync-client) which use the [AWS CLI command](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3/sync.html) directly. Comparatively, the linked project has much higher adoption and volume of maintainers / contributors. One reason for dropping support of this project is its major downfall in its lack of support for compression as noted in [issue #12](https://github.com/foo-software/s3-directory-sync-cli/issues/12).

Please consider using [s3-sync-client](https://github.com/jeanbmar/s3-sync-client) instead.

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
    <td><code>S3_DIRECTORY_SYNC_DERIVE_CONTENT_TYPE</code></td>
    <td>If set to <code>true</code> will derive `Content-Type` metadata from file extension via <a href="https://www.npmjs.com/package/mime-types"><code>mime-types</code></a></td>
    <td><code>false</code></td>
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
    <td><code>S3_DIRECTORY_SYNC_PROGRESS</code></td>
    <td>If set to <code>true</code> the CLI will display a progress bar. Might be buggy in CI which justifies this option.</td>
    <td><code>false</code></td>
  </tr>
  <tr>
    <td><code>S3_DIRECTORY_SYNC_REMOTE_DIRECTORY</code></td>
    <td>The directory of an S3 bucket to sync from a local directory. An empty string signifies the root.</td>
    <td><code>''</code></td>
  </tr>
  <tr>
    <td><code>S3_DIRECTORY_SYNC_REMOVE_HTML_EXTENSIONS</code></td>
    <td>If <code>true</code> HTML files will be uploaded with the `.html` extension omitted from the `Key`. This can be helpful if hosting an S3 website.</td>
    <td><code>false</code></td>
  </tr>
  <tr>
    <td><code>S3_DIRECTORY_SYNC_REMOVE_HTML_EXTENSIONS_EXCLUDE</code></td>
    <td>An escape hatch to the above <code>S3_DIRECTORY_SYNC_REMOVE_HTML_EXTENSIONS</code> option. In the future, perhaps we could make this into a regex, but for now you can populate this value with a comma-separated list of paths relative to the local directory. Example <code>static/html/iframe.html,static/html/iframe2.html</code> (no glob pattern or dot prefix).</td>
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

> <img src="https://lighthouse-check.s3.amazonaws.com/images/logo-simple-blue-light-512.png" width="100" height="100" align="left" /> This package was brought to you by [Foo - a website quality monitoring tool](https://www.foo.software). Automatically test and monitor website performance, SEO and accessibility with Lighthouse. Analyze historical records of Lighthouse tests with automated monitoring. Report with confidence about SEO and performance improvements to stay on top of changes when they happen!
