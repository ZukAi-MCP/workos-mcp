require('es6-promise').polyfill();

var _ = require('lodash');
var Big = require('big.js');
var batchGetRequest = require('./utils').batchGetRequest;
var bitcoinjs = require('bitcoinjs-lib');
var rejectCallback = require('./utils/reject-callback');
var resolveCallback = require('./utils/resolve-callback');


/**
 * check whether address(es) is correct from bitcoin point of view
 *
 * @private
 * @param addresses
 * @returns {Promise}
 */
function validateAddresses(addresses) {
    return new Promise(function(resolve, reject) {
        var invalidAddresses = [].concat(addresses).filter(function(address) {
            try {
                bitcoinjs.address.fromBase58Check(address);
            } catch (e) {
                return true;
            }
        });

        if (invalidAddresses.length === 1) {
            reject(new Error(invalidAddresses[0] + ' is not a valid address'));
        } else if (invalidAddresses.length > 1) {
            reject(new Error(invalidAddresses.join(', ') + ' are not a valid address'));
        } else {
            resolve();
        }
    });
}

function Addresses(url) {
    this.url = url;
}

/**
 * returns summer about address(es)
 *
 * @param ids
 * @param callback
 * @returns {axios.Promise}
 */
Addresses.prototype.summary = function(ids, callback) {
    var self = this;

    return validateAddresses(ids)
        .then(function() {
            return batchGetRequest(self.url + 'addrs/', ids);
        })
        .then(function(data) {
            return resolveCallback(ids, callback,
                data.map(function(res) {
                    return {
                        address: res.addrStr,
                        balance: res.balance + res.unconfirmedBalance,
                        totalReceived: res.totalReceivedSat,
                        txCount: res.txApperances + res.unconfirmedTxApperances,
                        txIds: res.transactions
                    };
                })
            );
        })
        .catch(function(err) {
            return rejectCallback(callback, err, err.item + ' is not a valid address');
        });
};

/**
 * returns transactions related to this address(es)
 *
 * @param addresses
 * @param blockHeightFilter
 * @param callback
 * @returns {axios.Promise}
 */
Addresses.prototype.transactions = function(addresses, blockHeightFilter, callback) {
    // optional blockHeight
    if (typeof blockHeightFilter === 'function') {
        callback = blockHeightFilter;
        blockHeightFilter = 0;
    }

    if (blockHeightFilter > 0) {
        console.warn('Insight API does not support blockHeight filter for addresses.transactions');
    }

    addresses = [].concat(addresses);

    var params = addresses.map(function(id) { return { id: id }; });

    return batchGetRequest(this.url + 'addrs/:id/txs', params)
        .then(function(data) {
            var result = _.flatten(data.map(function(address) {
                return address.items.map(function(tx) {
                    return {
                        blockHeight: tx.blockheight,
                        blockId: tx.blockhash,
                        txHex: tx.rawtx,
                        txId: tx.txid,
                        __blockTimestamp: tx.blocktime,
                        __confirmations: tx.confirmations
                    };
                });
            }));

            if (blockHeightFilter) {
                //filter transaction by block height
                //because Insight API doesn't support filtering we do it after result
                result = result.filter(function(tx) {
                    return !blockHeightFilter || blockHeightFilter === tx.blockHeight;
                });
            }

            return resolveCallback(addresses, callback, _.uniq(result, 'txId'), {
                arrayOnly: true
            });
        }, function(err) {
            return rejectCallback(callback, err, err.item.id + ' is not a valid address');
        });
};

/**
 * returns unspent transactions of address(es)
 *
 * @param addresses
 * @param callback
 * @returns {axios.Promise}
 */
Addresses.prototype.unspents = function(addresses, callback) {
    var self = this;

    addresses = [].concat(addresses);

    return validateAddresses(addresses)
        .then(function() {
            var params = addresses.map(function(id) { return { id: id }; });
            return batchGetRequest(self.url + 'addrs/:id/utxo', params);
        })
        .then(function(result) {
            result = _.flatten(result).map(function(tx) {
                var x = new Big(tx.amount);
                var smiloshis = parseInt(x.times(100000000).toFixed());
                return {
                    address: tx.address,
                    confirmations: tx.confirmations,
                    txId: tx.txid,
                    value: smiloshis,
                    vout: tx.vout
                };
            });
            return resolveCallback(addresses, callback, result, {
                arrayOnly: true
            });
        })
        .catch(function(err) {
            return rejectCallback(callback, err, err.item + ' is not a valid address');
        });
};

module.exports = Addresses;
