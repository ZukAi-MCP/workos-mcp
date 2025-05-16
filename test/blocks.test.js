/*eslint no-unused-expressions: 0*/

var Blockchain = require('../');
var chai = require('chai');
var setupFixtures = require('./setup-fixtures');

var expect = chai.expect;

describe('Blocks', function() {
  var blocks;

  before(function() {
    var api = new Blockchain('testnet');
    blocks = api.blocks;
  });

  before(setupFixtures.up);

  describe('get', function() {
    it('should return block', function(done) {
      blocks
        .get(
          '00000000000010efb93b48b18d489d9e959997dd4f9e2acaf3191ad9ec1aa3e4'
        )
        .then(function(res) {
          expect(res).to.exist;
          expect(res).to.has.property('blockId', '00000000000010efb93b48b18d489d9e959997dd4f9e2acaf3191ad9ec1aa3e4');
          done();
        })
        .catch(done);
    });

    it('should be able to request group of blocks', function(done) {
      blocks
        .get([
          '00000000000010efb93b48b18d489d9e959997dd4f9e2acaf3191ad9ec1aa3e4',
          '00000000a1e890e1c2cfe6edf939b83b9a4d6fd4b066324b84f67660215887b0'
        ])
        .then(function(res) {
          expect(res).to.be.instanceof(Array);
          expect(res).has.length(2);
          expect(res[0]).to.has.property('blockId', '00000000000010efb93b48b18d489d9e959997dd4f9e2acaf3191ad9ec1aa3e4');
          expect(res[1]).to.has.property('blockId', '00000000a1e890e1c2cfe6edf939b83b9a4d6fd4b066324b84f67660215887b0');

          done();
        })
        .catch(done);
    });

    it('should fail on wrong block it', function(done) {
      blocks
        .get('XXXX')
        .then(function() {
          done('does not fail');
        })
        .catch(function(err) {
          expect(err).to.exist;
          done();
        }).catch(done);
    });
  });

  describe('latest', function() {
    it('should return last block', function(done) {
      blocks
        .latest()
        .then(function(res) {
          expect(res).to.exist;
          expect(res).to.has.property('blockId', '00000000000010efb93b48b18d489d9e959997dd4f9e2acaf3191ad9ec1aa3e4');
          expect(res).to.has.property('blockHeight', 396393);
          expect(res).to.has.property('blockSize', 437402107);
          done();
        })
        .catch(done);
    });
  });

  describe('summary', function() {
    it('should return summary about block', function(done) {
      blocks
        .summary('00000000000010efb93b48b18d489d9e959997dd4f9e2acaf3191ad9ec1aa3e4')
        .then(function(res) {
          expect(res).to.exist;
          expect(res).to.has.property('blockId', '00000000000010efb93b48b18d489d9e959997dd4f9e2acaf3191ad9ec1aa3e4');
          expect(res).to.has.property('blockHeight', 396393);
          done();
        })
        .catch(done);
    });

    it('should be able to request group of blocks', function(done) {
      blocks
        .summary([
          '00000000000010efb93b48b18d489d9e959997dd4f9e2acaf3191ad9ec1aa3e4',
          '00000000a1e890e1c2cfe6edf939b83b9a4d6fd4b066324b84f67660215887b0'
        ])
        .then(function(res) {
          expect(res).to.be.instanceof(Array);
          expect(res).has.length(2);
          expect(res[0]).to.has.property('blockId', '00000000000010efb93b48b18d489d9e959997dd4f9e2acaf3191ad9ec1aa3e4');
          expect(res[0]).to.has.property('blockHeight', 396393);
          expect(res[1]).to.has.property('blockId', '00000000a1e890e1c2cfe6edf939b83b9a4d6fd4b066324b84f67660215887b0');
          expect(res[1]).to.has.property('blockHeight', 274302);
          done();
        })
        .catch(done);
    });

    it('should fail on wrong block id', function(done) {
      blocks
        .summary('XXXX')
        .then(function() {
          done('doe not fail');
        })
        .catch(function(err) {
          expect(err).to.exist;
          done();
        }).catch(done);
    });
  });

  after(setupFixtures.down);
});
