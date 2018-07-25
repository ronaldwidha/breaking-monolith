'use strict';

// dependencies
const AWS = require('aws-sdk');
const util = require('util');

const tableName = process.env.IMAGE_METADATA_DDB_TABLE;
const s3 = new AWS.S3();
const docClient = new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_DEFAULT_REGION
});

exports.tranformhandler = (event, context, callback) => {
    console.log("Reading input from event:\n", util.inspect(event, {depth: 5}));

    var filemeta = {
        Properties: event.Properties,
        size: event["size"],
        Filesize: event["Filesize"],
        format: event["format"]
    }

    this.transform(filemeta).then(callback);
}

exports.transform = function(filemeta) {
    var result = {};
    
    if (filemeta.Properties) {
        if (filemeta.Properties["exif:DateTimeOriginal"]) {
            result['creationTime'] = filemeta.Properties["exif:DateTimeOriginal"];
        }

        if (filemeta.Properties["exif:GPSLatitude"] && filemeta.Properties["exif:GPSLatitudeRef"] && filemeta.Properties["exif:GPSLongitude"] && filemeta.Properties["exif:GPSLongitudeRef"]) {
            try {
                const lat = parseCoordinate(filemeta.Properties["exif:GPSLatitude"], filemeta.Properties["exif:GPSLatitudeRef"]);
                const long = parseCoordinate(filemeta.Properties["exif:GPSLongitude"], filemeta.Properties["exif:GPSLongitudeRef"]);
                console.log("lat", lat);
                console.log("long", long);
                result.geo = {
                    'latitude': lat, "longitude": long
                }
            } catch (err) {
                // ignore failure in parsing coordinates
                console.log(err);
            }
        }
        if (filemeta.Properties["exif:Make"]) {
            result['exifMake'] = filemeta.Properties["exif:Make"];
        }
        if (filemeta.Properties["exif:Model"]) {
            result['exifModel'] = filemeta.Properties["exif:Model"];
        }
        result['dimensions'] = filemeta.size;
        result['fileSize'] = filemeta.Filesize;
        result['format'] = filemeta.format;
    }

    return Promise.resolve(result);
};

/**
 *
 * @param coordinate in the format of "DDD/number, MM/number, SSSS/number" (e.g. "47/1, 44/1, 3598/100")
 * @param coordinateDirection coordinate direction (e.g. "N" "S" "E" "W"
 * @returns {{D: number, M: number, S: number, Direction: string}}
 */
function parseCoordinate(coordinate, coordinateDirection) {

    const degreeArray = coordinate.split(",")[0].trim().split("/");
    const minuteArray = coordinate.split(",")[1].trim().split("/");
    const secondArray = coordinate.split(",")[2].trim().split("/");

    return {
        "D": parseInt(degreeArray[0]) / parseInt(degreeArray[1]),
        "M": parseInt(minuteArray[0]) / parseInt(minuteArray[1]),
        "S": parseInt(secondArray[0]) / parseInt(secondArray[1]),
        "Direction": coordinateDirection
    };
}

exports.storehandler = (event, context, callback) => {
    console.log("Reading input from event:\n", util.inspect(event, {depth: 5}));
    
    const srcBucket = event.s3Bucket;
    
    // Object key may have spaces or unicode non-ASCII characters.
    const srcKey = decodeURIComponent(event.s3Key.replace(/\+/g, " "));

    const imgref = {
        srcBucket: srcBucket,
        srcKey: srcKey
    };

    const items = event.extractedMetadata;
    
    this.store(imgref, items)
}



exports.store = function(imgref, items) {
    return Promise.resolve();
    // const s3ObjectParams = {
    //     Bucket: imgref.srcBucket,
    //     Key: imgref.srcKey
    // };
    
    // const s3ObjectMetadataPromise = s3.headObject(s3ObjectParams).promise();

    // return s3ObjectMetadataPromise.then((s3ObjectMetadata) => {
    //     const fileUploadTimeStamp = Math.floor(Date.parse(s3ObjectMetadata.LastModified) / 1000);
    //     console.log(util.inspect(s3ObjectMetadata, {depth: 5}));

    //     var UpdateExpression = 'SET uploadTime = :uploadTime, ' +
    //         'imageFormat = :format, dimensions = :dimensions, ' +
    //         'fileSize = :fileSize, userID = :userID, ' +
    //         'albumID = :albumID';

    //     var ExpressionAttributeValues = {
    //         ":uploadTime": fileUploadTimeStamp,
    //         ":format": items.format,
    //         ":dimensions": items.dimensions,
    //         ":fileSize": items.fileSize,
    //         ":userID": s3ObjectMetadata.Metadata.userid,
    //         ":albumID": s3ObjectMetadata.Metadata.albumid
    //     };

    //     if (items.geo) {
    //         UpdateExpression += ", latitude = :latitude"
    //         ExpressionAttributeValues[":latitude"] = items.geo.latitude;
    //         UpdateExpression += ", longitude = :longitude"
    //         ExpressionAttributeValues[":longitude"] = items.geo.longitude;
    //     }

    //     if (items.exifMake) {
    //         UpdateExpression += ", exifMake = :exifMake"
    //         ExpressionAttributeValues[":exifMake"] = items.exifMake;
    //     }
    //     if (items.exifModel) {
    //         UpdateExpression += ", exifModel = :exifModel"
    //         ExpressionAttributeValues[":exifModel"] = items.exifModel;
    //     }

    //     //todo: to make it independent from step functions terminology
        
    //     // if (event.parallelResults[0]) {
    //     //     const labels = event.parallelResults[0];
    //     //     var tags = labels.map((data) => {
    //     //         return data["Name"];
    //     //     });
    //     //     UpdateExpression += ", tags = :tags"
    //     //     ExpressionAttributeValues[":tags"] = tags;
    //     // }

    //     // if (event.parallelResults[1]) {
    //     //     UpdateExpression += ", thumbnail = :thumbnail"
    //     //     ExpressionAttributeValues[":thumbnail"] = event.parallelResults[1];
    //     // }

    //     console.log("UpdateExpression", UpdateExpression);
    //     console.log("ExpressionAttributeValues", ExpressionAttributeValues);

    //     var ddbparams = {
    //         TableName: tableName,
    //         Key: {
    //             'imageID': event.objectID
    //         },
    //         UpdateExpression: UpdateExpression,
    //         ExpressionAttributeValues: ExpressionAttributeValues,
    //         ConditionExpression: 'attribute_exists (imageID)'
    //     };

    //     return docClient.update(ddbparams).promise()
    // })
}