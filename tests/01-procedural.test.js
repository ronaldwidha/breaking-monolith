'use strict';

var test = require('unit.js');
var sut = require('../01-procedural.js');

describe('Monolith - Procedural Version', function() {
    
  it('exits gracefully', function(done) {
    sut.main();
    done();
  });
  
});
