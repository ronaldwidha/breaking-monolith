'use strict';

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


exports.store = function(items) {
    return new Promise(function (resolve, reject) {
        resolve();
    });
}