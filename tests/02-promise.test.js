'use strict';

var test = require('unit.js');
var sut = require('../02-promise.js');

describe('Monolith - Promise Version', function() {
    
  it('exits gracefully', function(done) {
    sut.main();
    done();
  });
  
});
