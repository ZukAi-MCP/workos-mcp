require('es6-promise').polyfill();

var assert = require('assert');
var batchGetRequest = require('./utils').batchGetRequest;
var bitcoinjs = require('bitcoinjs-lib');
var getRequest = require('./utils').getRequest;
var rejectCallback = require('./utils/reject-callback');
var resolveCallback = require('./utils/resolve-callback');

function Blocks(url) {
    this.url = url;
}

/**
 * request block by ids
 *
 * @param idsOrHeights
 * @param callback
 */
Blocks.prototype.get = function(idsOrHeights, callback) {
    return batchGetRequest(this.url + 'block/', idsOrHeights)
        .then(function(data) {
            var results = data.map(function(blockData) {
                var block = new bitcoinjs.Block();
                block.version = blockData.version;
                block.prevHash = new Buffer(blockData.previousblockhash, 'hex').reverse();
                block.merkleRoot = new Buffer(blockData.merkleroot, 'hex').reverse();
                block.timestamp = blockData.time;
                block.bits = parseInt(blockData.bits, 16);
                block.nonce = blockData.nonce;

                block.transactions = blockData.tx.map(function(tx) {
                    return bitcoinjs.Transaction.fromHex(tx.raw);
                });

                return {
                    blockHex: block.toHex(),
                    blockId: blockData.hash
                };
            });
            return resolveCallback(idsOrHeights, callback, results);
        })
        .catch(function(err) {
            return rejectCallback(callback, err, err.item + ' is not a valid blockId');
        });
};

/**
 * request last block
 *
 * @param callback
 * @returns {axios.Promise}
 */
Blocks.prototype.latest = function(callback) {
    var self = this;

    return getRequest(self.url + 'blocks')
        .then(function(data) {
            var blocks = data.blocks;
            return Promise.all([
                blocks.length > 1 ? blocks[1].hash : null,
                getRequest(self.url + 'block/' + blocks[0].hash)
            ]);
        })
        .then(function(blocks) {
            var previousHash = blocks[0];
            var block = blocks[1];

            return resolveCallback(null, callback, {
                blockId: block.hash,
                prevBlockId: previousHash,
                merkleRootHash: block.merkleroot,
                nonce: block.nonce,
                version: block.version,
                blockHeight: block.height,
                blockSize: parseInt(block.bits, 16),
                timestamp: block.time,
                txCount: block.tx.length
            });
        })
        .catch(function(err) {
            return rejectCallback(callback, err);
        });
};

Blocks.prototype.propagate = function() {
    assert(false, 'TODO');
};

/**
 * request block summary by id(s)
 *
 * @param ids
 * @param callback
 */
Blocks.prototype.summary = function(ids, callback) {
    try {
        return batchGetRequest(this.url + 'block/', ids)
            .then(function(data) {
                return data.map(function(block) {
                    return {
                        blockId: block.hash,
                        blockHeight: block.height,
                        prevBlockId: block.previousblockhash,
                        merkleRootHash: block.merkleroot,
                        nonce: block.nonce,
                        version: block.version,
                        blockSize: parseInt(block.bits, 16),
                        timestamp: block.time,
                        txCount: block.tx.length
                    };
                });
            })
            .then(function(results) {
                return resolveCallback(ids, callback, results);
            })
            .catch(function(err) {
                return rejectCallback(callback, err, err.item + ' is not a valid blockId');
            });
    } catch (err) {
        console.warn(err);
    }
};

Blocks.prototype.getServiceAddresses = function(callback) {
    return getRequest(this.url + 'getserviceaddresses')
        .then(function(data) {
            return data;
        })
        .then(function(data) {
            return resolveCallback(null, callback, data);
        })
        .catch(function(err) {
            return rejectCallback(callback, err);
        });
};

// TODO: might need some fixing
Blocks.prototype.getOrgList = function(orglistAddress, callback) {
    return getRequest(this.url + 'getorglist/' + orglistAddress)
        .then(function(data){
            return resolveCallback(null, callback, data);
        })
        .catch(function(err) {
            return rejectCallback(callback, err);
        });
};

Blocks.prototype.getAllOrgLists = function(callback) {
    return getRequest(this.url + 'getallorglists/')
	.then(function(data){
	    return resolveCallback(null, callback, data);
	})
	.catch(function(err) {
		return rejectCallback(callback, err);
	});

};


Blocks.prototype.getAllCouponLists = function(callback) {
    return getRequest(this.url + 'getallcouponlists/')
    .then(function(data){
        return resolveCallback(null, callback, data);
    }).catch(function(err){
        return rejectCallback(callback,err);
    });
}

module.exports = Blocks;
