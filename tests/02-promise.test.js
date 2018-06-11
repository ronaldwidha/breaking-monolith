'use strict';

var test = require('unit.js');
var sut = require('../02-promise.js');

describe('Monolith - Promise Version', function() {
  var metadata = require('../lib/metadata');
  var validator = require('../lib/validator');
  var metadatastore = require('../lib/metadatastore');
  var almightyinterpreter = require('../lib/almightyinterpreter');
  var imageprocessor = require('../lib/imageprocessor');
  
  it('exits gracefully', function(done) {
    sut.main().then(done());
  });
  
  
  describe('when image type is not supported', function () {
    
    validator.isSupported = function(foo) { return false; }
    
    it('throws an exception', function(done) {
      sut.main_go(metadata, validator, metadatastore, almightyinterpreter, imageprocessor)
        .then(() => done('Exception expected but not found'))
        .catch((err) => done());
    });
    
  });
});
