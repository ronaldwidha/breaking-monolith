'use strict';

var metadata = require('./lib/metadata');
var validator = require('./lib/validator');
var metadatastore = require('./lib/metadatastore');
var almightyinterpreter = require('./lib/almightyinterpreter');
var imageprocessor = require('./lib/imageprocessor');

exports.main = function() {
    // extract metadata
    var img = loadImage();
    
    var filemeta = metadata.extract(img);
    validator.isSupported(filemeta);
    
    var imagemetadata = metadatastore.transform(filemeta);
    
    // image recognition
    var labels = almightyinterpreter.recognizePicture(img);
    metadatastore.store([imagemetadata, labels]);
    
    // generate thumbnail
    imageprocessor.generateThumbnail(img);
}