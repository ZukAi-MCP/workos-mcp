var _ = require('lodash');
var nock = require('nock');

var addresses = require('./fixtures/addresses.json');
var addressesTxs = require('./fixtures/addresses.txs.json');
var addressesUtxo = require('./fixtures/addresses.utxo.json');
var blocks = require('./fixtures/blocks.json');
var rawTransactions = require('./fixtures/transactions.rawtx.json');
var transactions = require('./fixtures/transactions.tx.json');

var root = nock('https://test-insight.bitpay.com');

function getItemByUri(uri, regex, list) {
  var res = regex.exec(uri);
  if (!res || res.length === 0) {
    return [];
  }

  return _.compact(decodeURIComponent(res[1])
    .split(',')
    .map(function(id) {
      return list[id];
    }));
}

function mockEndpoint(pattern, items) {
  root
    .get(function(uri) {
      return getItemByUri(uri, pattern, items).length > 0;
    })
    .reply(function(uri) {
      var l = getItemByUri(uri, pattern, items);
      if (l.length === 1) {
        return l[0];
      }
      return l;
    });
}

_.forEach(blocks, function(block) {
  block.tx = block.tx.map(function(id) {
    var obj = rawTransactions[id];
    return {
      id: id,
      raw: obj && obj.rawtx
    };
  });
});

module.exports = {
  up: function() {
    mockEndpoint(/^\/api\/addrs\/([\w%]*)$/, addresses);
    mockEndpoint(/^\/api\/addrs\/([\w%]*)\/txs$/, addressesTxs);
    mockEndpoint(/^\/api\/addrs\/([\w%]*)\/utxo$/, addressesUtxo);
    mockEndpoint(/^\/api\/block\/([\w%]*)$/, blocks);

    root
      .get('/api/blocks')
      .reply(200, {blocks: _.values(blocks)})
      .persist();

    mockEndpoint(/^\/api\/rawtxs\/([\w%]*)$/, rawTransactions);
    mockEndpoint(/^\/api\/txs\/([\w%]*)$/, transactions);

    root
      .post('/api/tx/send', {
        rawtx:
        '01000000016e90f86ccebd3caf5a339633bfdb28c1ae6961a752ad21e8e212b1e97a8965b40' +
        '10000006b483045022100d1eb848df7594a5f9b697dea0bf733c8ec87dec2b63142e4b572b0' +
        '7f2f09d12702200f6b124db6689e645f39e57d6cffcfb5f5869c089c4f1922ef6e6cfe3f07e' +
        '8e20121037ce0c786277fafc38e2e2d49b1be36f02a360ba4a2dd58cf977784975a573fb6ff' +
        'ffffff02c0175302000000001976a91461120f6e004c7a2e20ecdedf461f1eb032c2e5c388a' +
        'c48698831d00000001976a9140fe1355e31a061b2508919578b6f8c60dd2f29cf88ac00000000'
      })
      .reply(200, {
        txid: 'qwerty'
      })
      .persist();

    root
      .post('/api/tx/send', {
        rawtx:
        '01000000011c1020c1114820e7c44e12e804aec5f4af1e8a6aad3c446c4cfc8aa53e61f73d010' +
        '000008a47304402200fea124cecd36e92cb0b549b62740a26f374629b26f16292a3e858753035' +
        '172802205ba172966addddbbe8181af6cd7fb6e9c53414fb6727c4f15589c74567e48ab301410' +
        '40cfa3dfb357bdff37c8748c7771e173453da5d7caa32972ab2f5c888fff5bbaeb5fc812b473b' +
        'f808206930fade81ef4e373e60039886b51022ce68902d96ef70ffffffff02204e00000000000' +
        '01976a91461120f6e004c7a2e20ecdedf461f1eb032c2e5c388acabfb423d000000001976a914' +
        '61b469ada61f37c620010912a9d5d56646015f1688ac00000000'
      })
      .reply(200, {
        txid: 'asdfgh'
      })
      .persist();
  },

  down: function() {
    nock.cleanAll();
  }
};
