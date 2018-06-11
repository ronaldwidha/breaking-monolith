'use strict';

var metadata = require('./lib/metadata');
var validator = require('./lib/validator');
var metadatastore = require('./lib/metadatastore');
var almightyinterpreter = require('./lib/almightyinterpreter');
var imageprocessor = require('./lib/imageprocessor');

exports.main = function() {
    
    // extract metadata
    var img = { 's3Bucket': 'a', 's3Key': '' };
    
    metadata.extract(img).then((filemeta) => {

        if (!validator.isSupported(filemeta))
            throw "Not supported image type";
            
        metadatastore.transform(filemeta).then((imagemetadata) => {

            // image recognition
            almightyinterpreter.recognizePicture(filemeta).then((labels) => {
                
                // console.log("IMG " + JSON.stringify(img));
                // console.log("META " + JSON.stringify(filemeta));
                // console.log("LABELS " + JSON.stringify(labels));

                metadatastore.store([imagemetadata, labels]);
                
                // generate thumbnail
                imageprocessor.generateThumbnail(img);
            });
        });
    });
}