'use strict';

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var sut = require('../02-promise.js');

describe('Monolith - Promise Version Integration Testing', function() {

  
  // describe('when everything all ok', function () {
  //   it('exits gracefully', function(done) {
  //     sut.main().should.be.fulfilled.and.notify(done);
  //   });
  // });
  
  describe.only('when image type is supported', function () {
    var metadata = require('../lib/metadata');
    var validator = require('../lib/validator');
    var metadatastore = require('../lib/metadatastore');
    var almightyinterpreter = require('../lib/almightyinterpreter');
    var imageprocessor = require('../lib/imageprocessor');

    it('throws an exception', function(done) {
      sut.main_go('widha-sandbox', 'supported-image.jpg', metadata, validator, metadatastore, almightyinterpreter, imageprocessor)
        .should.be.fulfilled
        .and.notify(done);
    })
  });
  
  describe('when image type is not supported', function () {
    var metadata = require('../lib/metadata');
    var validator = require('../lib/validator');
    var metadatastore = require('../lib/metadatastore');
    var almightyinterpreter = require('../lib/almightyinterpreter');
    var imageprocessor = require('../lib/imageprocessor');
    var validator_false = new Object();
    validator_false.isSupported = function(foo) { return false; }
    
    it('throws an exception', function(done) {
      sut.main_go('widha-sandbox', 'not-supported-file.js', metadata, validator, {}, {}, {})
        .should.be.rejectedWith(Error)
        .and.notify(done);
    })
  });
});
