var assert = require('assert');

var Addresses = require('./lib/addresses');
var Blocks = require('./lib/blocks');
var Transactions = require('./lib/transactions');

function Wrapper(network, baseURL) {
    network = network || 'smileycoin';
    // Nota skodari.broslaugin.com meðan bálkaskoðari 
    // er ekki uppfærður 
    // Use skodari.broslaugin.com for testing while
    // main block explorer has not been updated
    baseURL = baseURL || 'https://blocks.smileyco.in/api/';
    //baseURL = baseURL || 'https://skodari.broslaugin.com/api/';

    // end points
    this.addresses = new Addresses(baseURL);
    this.blocks = new Blocks(baseURL);
    this.transactions = new Transactions(baseURL);

    this.apiURL = baseURL;
    this.network = network;
}

Wrapper.Addresses = Addresses;
Wrapper.Blocks = Blocks;
Wrapper.Transactions = Transactions;

Wrapper.prototype.getNetwork = function() { return this.network; };

module.exports = Wrapper;