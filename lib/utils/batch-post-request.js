require('es6-promise').polyfill();

var axios = require('axios');

module.exports = function(url, items) {
  return Promise.all([].concat(items).map(function(item) {
    return axios.post(url, item);
  }));
};
