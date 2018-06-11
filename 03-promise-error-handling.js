'use strict';

var metadata = require('./lib/metadata');
var validator = require('./lib/validator');
var metadatastore = require('./lib/metadatastore');
var almightyinterpreter = require('./lib/almightyinterpreter');
var imageprocessor = require('./lib/imageprocessor');

exports.main = function() {
    return this.main_go(metadata, validator, metadatastore, almightyinterpreter, imageprocessor);
}

exports.main_go = function(metadata, validator, metadatastore, almightyinterpreter, imageprocessor) {
    
    var img = { 's3Bucket': 'a', 's3Key': '' };

    // extract metadata    
    return metadata.extract(img).then((filemeta) => {

        if (!validator.isSupported(filemeta))
            return Promise.reject("Not supported image type");
            
        return metadatastore.transform(filemeta).then((imagemetadata) => {

            // image recognition
            return almightyinterpreter.recognizePicture(img).then((labels) => {
                
                // console.log("IMG " + JSON.stringify(img));
                // console.log("META " + JSON.stringify(filemeta));
                // console.log("LABELS " + JSON.stringify(labels));
                
                return Promise.all([
                        metadatastore.store([imagemetadata, labels]),
                        imageprocessor.generateThumbnail(img) // generate thumbnail
                    ]).error((err) => {
                        //handle error
                        
                        // log
                        
                        
                    });
                
            }).error((err) => {
                // handle error
                
                // log
                
                // retry logic
                  
                // retrying the retry
                
                // exponential back off
                
                // give up retry
                
                // compensating transaction?
                
                // TOO HARD!!!!
            });
        });
    });
}