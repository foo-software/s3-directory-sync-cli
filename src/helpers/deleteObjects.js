// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObjects-property
export default ({ params, s3 }) =>
  new Promise((resolve, reject) => {
    s3.deleteObjects(params, (error, data) => {
      if (!error) {
        resolve(data);
      } else {
        reject(error);
      }
    });
  });
