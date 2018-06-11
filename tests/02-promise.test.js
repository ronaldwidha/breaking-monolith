'use strict';

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var sut = require('../02-promise.js');

describe('Monolith - Promise Version', function() {
  var metadata = require('../lib/metadata');
  var validator = require('../lib/validator');
  var metadatastore = require('../lib/metadatastore');
  var almightyinterpreter = require('../lib/almightyinterpreter');
  var imageprocessor = require('../lib/imageprocessor');
  
  describe('when everything all ok', function () {
    it('exits gracefully', function(done) {
      sut.main().then(() => done());
    });
  });
  
  describe('when image type is not supported', function () {
    
    var validator_false = new Object();
    validator_false.isSupported = function(foo) { return false; }
    
    it('throws an exception', function(done) {
      sut.main_go(metadata, validator_false, metadatastore, almightyinterpreter, imageprocessor)
        .should.be.rejected.and.notify(done);
    })
  });

});
