/*eslint no-unused-expressions: 0*/

var Blockchain = require('../');
var chai = require('chai');
var setupFixtures = require('./setup-fixtures');

var expect = chai.expect;


describe('Transactions', function() {
  var transactions;

  before(function() {
    var api = new Blockchain('testnet');
    transactions = api.transactions;
  });

  before(setupFixtures.up);

  describe('get', function() {
    it('should empty value if id is not passed', function(done) {
      transactions
        .get()
        .then(function(res) {
          expect(res).to.not.exist;
          done();
        })
        .catch(done);
    });

    it('should fail on incorrect transaction id', function(done) {
      transactions
        .get('XXXX')
        .then(function() {
          done('does not fail');
        })
        .catch(function(err) {
          expect(err).to.exist;
          expect(err.message).to.exist;
          done();
        }).catch(done);
    });

    it('should return transaction', function(done) {
      transactions
        .get('4979a0b69703f888dc5936a4be039dabb976fae7d45604d57b5fad35b3c94200')
        .then(function(res) {
          expect(res).to.exist;
          expect(res).to.has.property('txId', '4979a0b69703f888dc5936a4be039dabb976fae7d45604d57b5fad35b3c94200');
          expect(res).to.has.property('confirmations', 230572);
          done();
        })
        .catch(done);
    });

    it('should be able to request group of transactions', function(done) {
      transactions
        .get([
          '4979a0b69703f888dc5936a4be039dabb976fae7d45604d57b5fad35b3c94200',
          'ffd316b0c4feb9d29c61c3734fcde0167600441e560931c8c7267a9de3d9e29a'
        ])
        .then(function(res) {
          expect(res).to.be.instanceof(Array);
          expect(res).has.length(2);

          expect(res[0]).to.has.property('txId', '4979a0b69703f888dc5936a4be039dabb976fae7d45604d57b5fad35b3c94200');
          expect(res[0]).to.has.property('confirmations', 230572);
          expect(res[1]).to.has.property('txId', 'ffd316b0c4feb9d29c61c3734fcde0167600441e560931c8c7267a9de3d9e29a');
          expect(res[1]).to.has.property('confirmations', 352331);

          done();
        })
        .catch(done);
    });
  });

  describe.skip('latest', function() {
    it('should return last transaction', function(done) {
      transactions
        .latest()
        .then(function() {
          done();
        })
        .catch(done);
    });
  });

  describe('propagate', function() {
    it('should add new transaction', function(done) {
      transactions
        .propagate('01000000016e90f86ccebd3caf5a339633bfdb28c1ae6961a752ad21e8e212b1e97a8965b40' +
                   '10000006b483045022100d1eb848df7594a5f9b697dea0bf733c8ec87dec2b63142e4b572b0' +
                   '7f2f09d12702200f6b124db6689e645f39e57d6cffcfb5f5869c089c4f1922ef6e6cfe3f07e' +
                   '8e20121037ce0c786277fafc38e2e2d49b1be36f02a360ba4a2dd58cf977784975a573fb6ff' +
                   'ffffff02c0175302000000001976a91461120f6e004c7a2e20ecdedf461f1eb032c2e5c388a' +
                   'c48698831d00000001976a9140fe1355e31a061b2508919578b6f8c60dd2f29cf88ac00000000')
        .then(function(res) {
          expect(res).to.exist;
          expect(res).to.has.property('txid', 'qwerty');
          done();
        })
        .catch(done);
    });

    it('should add few transactions at once', function(done) {
      transactions
        .propagate([
          '01000000016e90f86ccebd3caf5a339633bfdb28c1ae6961a752ad21e8e212b1e97a8965b40' +
          '10000006b483045022100d1eb848df7594a5f9b697dea0bf733c8ec87dec2b63142e4b572b0' +
          '7f2f09d12702200f6b124db6689e645f39e57d6cffcfb5f5869c089c4f1922ef6e6cfe3f07e' +
          '8e20121037ce0c786277fafc38e2e2d49b1be36f02a360ba4a2dd58cf977784975a573fb6ff' +
          'ffffff02c0175302000000001976a91461120f6e004c7a2e20ecdedf461f1eb032c2e5c388a' +
          'c48698831d00000001976a9140fe1355e31a061b2508919578b6f8c60dd2f29cf88ac00000000',

          '01000000011c1020c1114820e7c44e12e804aec5f4af1e8a6aad3c446c4cfc8aa53e61f73d010' +
          '000008a47304402200fea124cecd36e92cb0b549b62740a26f374629b26f16292a3e858753035' +
          '172802205ba172966addddbbe8181af6cd7fb6e9c53414fb6727c4f15589c74567e48ab301410' +
          '40cfa3dfb357bdff37c8748c7771e173453da5d7caa32972ab2f5c888fff5bbaeb5fc812b473b' +
          'f808206930fade81ef4e373e60039886b51022ce68902d96ef70ffffffff02204e00000000000' +
          '01976a91461120f6e004c7a2e20ecdedf461f1eb032c2e5c388acabfb423d000000001976a914' +
          '61b469ada61f37c620010912a9d5d56646015f1688ac00000000'
        ])
        .then(function(res) {
          expect(res).to.be.instanceof(Array);
          expect(res).has.length(2);
          expect(res[0]).to.has.property('txid', 'qwerty');
          expect(res[1]).to.has.property('txid', 'asdfgh');
          done();
        })
        .catch(done);
    });
  });

  after(setupFixtures.down);
});
