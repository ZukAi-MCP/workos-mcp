/*eslint no-new: 0*/

var assert = require('assert');
var Blockchain = require('../');
var chai = require('chai');
var expect = chai.expect;

describe('Blockchain', function() {
  describe('Constructor', function() {
    it('defaults to the bitcoin network', function() {
      var blockchain = new Blockchain();

      assert.equal(blockchain.getNetwork(), 'bitcoin');
    });

    it('should setup api network url form params', function() {
      var blockchain = new Blockchain('testnet', 'http://test-insight.some-test.url/');
      expect(blockchain.apiURL).to.equal('http://test-insight.some-test.url/');
    });
  });

  describe('getNetwork', function() {
    it('returns the underlying network name', function() {
      var blockchain = new Blockchain('testnet');

      assert.equal(blockchain.getNetwork(), 'testnet');
    });
  });
});
