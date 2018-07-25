'use strict';

// dependencies
const AWS = require('aws-sdk');
const gm = require('gm').subClass({imageMagick: true}); // Enable ImageMagick integration.
const util = require('util');
const Promise = require('bluebird');
Promise.promisifyAll(gm.prototype);

// get reference to S3 client
const s3 = new AWS.S3();

exports.handler = (event, context, callback) => {
    // Read input from the event.
    console.log("Reading input from event:\n", util.inspect(event, {depth: 5}));
    const srcBucket = event.s3Bucket;
    
    // Object key may have spaces or unicode non-ASCII characters.
    const srcKey = decodeURIComponent(event.s3Key.replace(/\+/g, " "));

    this.extract({
            srcBucket: srcBucket,
            srcKey: srcKey
        }, callback);
}

exports.extract = function(fileref) {

    const srcBucket = fileref.srcBucket;
    const srcKey = fileref.srcKey;
    
    var getObjectPromise = s3.getObject({
        Bucket: srcBucket,
        Key: srcKey
    }).promise();

    return getObjectPromise.then((getObjectResponse) => gm(getObjectResponse.Body).identifyAsync())
    .catch(function (err) { return Promise.reject(new ImageIdentifyError(err)); });
};

function ImageIdentifyError(message) {
    this.name = "ImageIdentifyError";
    this.message = message;
}
ImageIdentifyError.prototype = new Error();