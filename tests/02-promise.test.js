'use strict';

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var sut = require('../02-promise.js');

describe('Monolith - Promise Version', function() {
  
  var metadata = {}; metadata.extract = (img) => Promise.resolve({});
  const metadatastore = {
    transform: (filemeta) => Promise.resolve({}),
    store: (labels) => Promise.resolve({})
  }
  var almightyinterpreter = {}; almightyinterpreter.recognizePicture = (img) => Promise.resolve({});
  var imageprocessor = {}; imageprocessor.generateThumbnail = (img) => Promise.resolve({});
    
  describe('when everything all ok', function () {
    var validator = { isSupported: (filemeta) => true }
    it('exits gracefully', function(done) {
      sut.main_go('foo', 'bar', metadata, validator, metadatastore, almightyinterpreter, imageprocessor)
        .should.be.fulfilled.and.notify(done);
    });
  });
  
  describe('when image type is not supported', function () {
    var validator = { isSupported: (filemeta) => false }
    it('throws an exception', function(done) {
      sut.main_go('foo', 'bar', metadata, validator, metadatastore, almightyinterpreter, imageprocessor)
        .should.be.rejected.and.notify(done);
    });
  });
});
