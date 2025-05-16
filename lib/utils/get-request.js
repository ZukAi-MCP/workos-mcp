require('es6-promise').polyfill();

var axios = require('axios');

var delay = require('./delay');

function request(url, retry, delayBeforeRetry, params) {
  return axios.get(url, {params: params})
    .catch(function(err) {
      if (err.code === 'ECONNRESET' && --retry > 0) {
        return delay(delayBeforeRetry)
          .then(function() {
            return request(url, retry);
          });
      }
      return Promise.reject(err);
    });
}

/**
 * async request data by GET and return Promise
 *
 * @param url
 * @param options
 * @returns {Promise}
 */
module.exports = function(url, options) {
  options = options || {};
  return request(url, options.retry || 100, options.delayBeforeRetry !== undefined ? options.delayBeforeRetry : 1000, options.params || {})
    .then(function(res) {
      return res.data;
    });
};
