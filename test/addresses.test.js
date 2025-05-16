/*eslint no-unused-expressions: 0*/

var Blockchain = require('../');
var chai = require('chai');
var setupFixtures = require('./setup-fixtures');

var expect = chai.expect;

describe('Addresses', function() {
  var addresses;

  before(function() {
    var api = new Blockchain('testnet', '');
    addresses = api.addresses;
  });

  before(setupFixtures.up);

  describe('summary', function() {
    it('should return address', function(done) {
      addresses
        .summary(
          'mpNDUWcDcZw1Teo3LFHvr8usNdwDLKdTaY'
        )
        .then(function(res) {
          expect(res).to.exist;
          expect(res).to.has.property('address', 'mpNDUWcDcZw1Teo3LFHvr8usNdwDLKdTaY');
          done();
        })
        .catch(done);
    });

    it('should fail on incorrect address id', function(done) {
      addresses
        .summary('XXXX')
        .then(function() {
          done('does not fail');
        })
        .catch(function(err) {
          expect(err.message).to.equal('XXXX is not a valid address');
          done();
        });
    });

    it('should be able to request group of addresses', function(done) {
      addresses
        .summary([
          '2NBXcxopF9gs8sg9KfgPtKRsVZ6HyWVPHQY',
          'mpNDUWcDcZw1Teo3LFHvr8usNdwDLKdTaY'
        ])
        .then(function(res) {
          expect(res).to.be.instanceof(Array);
          expect(res).has.length(2);
          expect(res[0]).to.has.property('address', '2NBXcxopF9gs8sg9KfgPtKRsVZ6HyWVPHQY');
          expect(res[1]).to.has.property('address', 'mpNDUWcDcZw1Teo3LFHvr8usNdwDLKdTaY');
          done();
        })
        .catch(done);
    });
  });

  describe('transactions', function() {
    it('should return transactions', function(done) {
      addresses
        .transactions(
          'mpNDUWcDcZw1Teo3LFHvr8usNdwDLKdTaY'
        )
        .then(function(res) {
          expect(res).to.be.instanceof(Array);
          expect(res).has.length(2);
          expect(res[0]).to.has.property('blockId', '00000000000010efb93b48b18d489d9e959997dd4f9e2acaf3191ad9ec1aa3e4');
          expect(res[0]).to.has.property('txId', '4979a0b69703f888dc5936a4be039dabb976fae7d45604d57b5fad35b3c94200');
          expect(res[1]).to.has.property('blockId', '00000000a1e890e1c2cfe6edf939b83b9a4d6fd4b066324b84f67660215887b0');
          expect(res[1]).to.has.property('txId', 'ffd316b0c4feb9d29c61c3734fcde0167600441e560931c8c7267a9de3d9e29a');
          done();
        })
        .catch(done);
    });

    it('should fail on incorrect address id', function(done) {
      addresses
        .transactions('XXXX')
        .then(function() {
          done('does not fail');
        })
        .catch(function(err) {
          expect(err).to.exist;
          done();
        }).catch(done);
    });

    it('should be able to request group of addresses', function(done) {
      addresses
        .transactions([
          '2NBXcxopF9gs8sg9KfgPtKRsVZ6HyWVPHQY',
          'mpNDUWcDcZw1Teo3LFHvr8usNdwDLKdTaY'
        ])
        .then(function(res) {
          expect(res).to.be.instanceof(Array);
          expect(res).has.length(3);
          expect(res[0]).to.has.property('blockId', '00000000000007dc622b16ab6698ad580c69e7e21c59bc9474418e85c6f3489a');
          expect(res[0]).to.has.property('txId', '6560380b5b8fc147e760545ff72eb3aca05116326509dea0157faf94dbe4ac32');
          expect(res[1]).to.has.property('blockId', '00000000000010efb93b48b18d489d9e959997dd4f9e2acaf3191ad9ec1aa3e4');
          expect(res[1]).to.has.property('txId', '4979a0b69703f888dc5936a4be039dabb976fae7d45604d57b5fad35b3c94200');
          expect(res[2]).to.has.property('blockId', '00000000a1e890e1c2cfe6edf939b83b9a4d6fd4b066324b84f67660215887b0');
          expect(res[2]).to.has.property('txId', 'ffd316b0c4feb9d29c61c3734fcde0167600441e560931c8c7267a9de3d9e29a');
          done();
        })
        .catch(done);
    });
  });

  describe('unspents', function() {
    it('should return transactions', function(done) {
      addresses
        .unspents(
          'mpNDUWcDcZw1Teo3LFHvr8usNdwDLKdTaY'
        )
        .then(function(res) {
          expect(res).to.be.instanceof(Array);
          expect(res).has.length(2);
          expect(res[0]).to.has.property('address', 'mpNDUWcDcZw1Teo3LFHvr8usNdwDLKdTaY');
          expect(res[0]).to.has.property('txId', 'ffd316b0c4feb9d29c61c3734fcde0167600441e560931c8c7267a9de3d9e29a');
          expect(res[1]).to.has.property('address', 'mpNDUWcDcZw1Teo3LFHvr8usNdwDLKdTaY');
          expect(res[1]).to.has.property('txId', '4979a0b69703f888dc5936a4be039dabb976fae7d45604d57b5fad35b3c94200');
          done();
        })
        .catch(done);
    });

    it('should fail on incorrect address id', function(done) {
      addresses
        .unspents('XXXX')
        .then(function() {
          done('does not fail');
        })
        .catch(function(err) {
          expect(err).to.exist;
          done();
        });
    });

    it('should be able to request group of addresses', function(done) {
      addresses
        .unspents([
          'mpNDUWcDcZw1Teo3LFHvr8usNdwDLKdTaY',
          'mvJCbQvE6DgVAECMwDprASP3NMwuU53Eie'
        ])
        .then(function(res) {
          expect(res).to.be.instanceof(Array);
          expect(res).has.length(3);

          expect(res[0]).to.has.property('address', 'mpNDUWcDcZw1Teo3LFHvr8usNdwDLKdTaY');
          expect(res[0]).to.has.property('txId', 'ffd316b0c4feb9d29c61c3734fcde0167600441e560931c8c7267a9de3d9e29a');

          expect(res[1]).to.has.property('address', 'mpNDUWcDcZw1Teo3LFHvr8usNdwDLKdTaY');
          expect(res[1]).to.has.property('txId', '4979a0b69703f888dc5936a4be039dabb976fae7d45604d57b5fad35b3c94200');

          expect(res[2]).to.has.property('address', 'mvJCbQvE6DgVAECMwDprASP3NMwuU53Eie');
          expect(res[2]).to.has.property('txId', '41017e25bed3b740508fc10286ffd363935698bd541ac8c43d8fad52cde25220');

          done();
        })
        .catch(done);
    });
  });

  after(setupFixtures.down);
});
