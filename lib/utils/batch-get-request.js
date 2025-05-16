require('es6-promise').polyfill();

var _ = require('lodash');
var getRequest = require('./get-request');
var pathToRegexp = require('path-to-regexp');

/**
 * async request data by GET and return Promise
 *
 * @param urls
 * @param items
 * @param options
 * @returns {Promise}
 */
module.exports = function(urls, items, options) {
  options = options || {};

  items = items !== undefined ? [].concat(items) : [];

  //filter empty items
  items = items.filter(function(item) {
    return !!item;
  });

  //group items by chunks
  var maxChunk = options.maxChunk || 50;
  var isString = !Array.isArray(items) || typeof items[0] !== 'object';

  if (isString) {
    items = _.chunk(items, maxChunk).map(function(items) {
      return items.join(',');
    });
  } else {
    items = _.chunk(items, maxChunk).map(function(items) {
      return items.reduce(function(sum, item) {
        Object.keys(item).forEach(function(key) {
          if (sum[key]) {
            sum[key] += ',' + item[key];
          } else {
            sum[key] = '' + item[key];
          }
        });
        return sum;
      }, {});
    });
  }

  return Promise.all([].concat(urls).map(function(url) {
    return Promise.all(items.map(function(item) {
      var tokens = pathToRegexp.parse(url);
      var queryUrl;

      if (tokens.length > 1) {
        queryUrl = pathToRegexp.tokensToFunction(tokens)(item);
      } else {
        queryUrl = url + encodeURIComponent(item);
      }

      return getRequest(queryUrl, options);
    }));
  })).then(function(res) {
    res = res.map(function(items) {
      return _.flatten([].concat(items));
    });

    if (Array.isArray(urls)) {
      res = _.zip.apply(null, res);
    } else {
      res = res[0];
    }

    return res;
  });
};
