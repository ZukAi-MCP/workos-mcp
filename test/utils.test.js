/*eslint no-unused-expressions: 0*/

var batchGetRequest = require('../lib/utils').batchGetRequest;
var batchPostRequest = require('../lib/utils').batchPostRequest;
var chai = require('chai');
var expect = chai.expect;
var getRequest = require('../lib/utils').getRequest;
var nock = require('nock');

describe('utils', function() {
  this.timeout(100);

  describe('batch request', function() {
    it('should return empty array if there no any items are passed', function(done) {
      batchGetRequest('http://some.org/url')
        .then(function(res) {
          expect(res).to.be.empty;
          done();
        })
        .catch(done);
    });

    it('should retry on ECONNRESET', function(done) {
      var i = 4;
      while (--i >= 0) {
        nock('http://google.com')
          .get('/cat-poems/1')
          .replyWithError({code: 'ECONNRESET', errno: 'ECONNRESET', syscall: 'read'});
      }

      nock('http://google.com')
        .get('/cat-poems/1')
        .reply(200, 'Hello World!');

      batchGetRequest('http://google.com/cat-poems/', 1, {retry: 5, delayBeforeRetry: 0})
        .then(function(res) {
          expect(res[0]).to.equal('Hello World!');
          done();
        })
        .catch(done);
    });

    it('should fail after number of retries is over', function(done) {
      var i = 5;
      while (--i >= 0) {
        nock('http://google.com')
          .get('/missed-cat-poems/1')
          .replyWithError({code: 'ECONNRESET', errno: 'ECONNRESET', syscall: 'read'});
      }

      nock('http://google.com')
        .get('/missed-cat-poems/1')
        .reply(200, 'Hello World!');

      batchGetRequest('http://google.com/missed-cat-poems/', '1', {retry: 5, delayBeforeRetry: 0})
        .then(function(res) {
          done('got result', res);
        })
        .catch(function(err) {
          expect(err.code).to.equal('ECONNRESET');
          done();
        });
    });

    it('should do single request GET http://some.org/url/:id and return Promise on successful response', function(done) {
      nock('http://some.org')
        .get('/url/123456')
        .reply(200, 'Hello World!');

      batchGetRequest('http://some.org/url/', 123456)
        .then(function(res) {
          expect(res[0]).to.equal('Hello World!');
          done();
        })
        .catch(done);
    });

    it('should do multi request GET http://some.org/url/:id and return Promise on successful response', function(done) {
      nock('http://some.org')
        .get('/url/1')
        .reply(200, 'Hello World 1!');

      nock('http://some.org')
        .get('/url/2')
        .reply(200, 'Hello World 2!');

      batchGetRequest('http://some.org/url/', [1, 2], {
        maxChunk: 1
      })
        .then(function(res) {
          expect(res[0]).to.equal('Hello World 1!');
          expect(res[1]).to.equal('Hello World 2!');
          done();
        })
        .catch(done);
    });

    it('should do single request GET http://some.org/url/:id1,id2 and return Promise on successful response', function(done) {
      nock('http://some.org')
        .get('/url/' + encodeURIComponent('1,2'))
        .reply(200, [
          'Hello World 1!',
          'Hello World 2!'
        ]);

      batchGetRequest('http://some.org/url/', [1, 2], {
        maxChunk: 10
      })
        .then(function(res) {
          expect(res[0]).to.equal('Hello World 1!');
          expect(res[1]).to.equal('Hello World 2!');
          done();
        })
        .catch(done);
    });

    it('should do multi request GET http://some.org/url/:id and http://another.org/url/:id and return Promise on successful response', function(done) {
      nock('http://one.org')
        .get('/url/1')
        .reply(200, 'Hello One World!');

      nock('http://another.org')
        .get('/url/1')
        .reply(200, 'Hello Another World!');

      batchGetRequest(['http://one.org/url/', 'http://another.org/url/'], 1)
        .then(function(res) {
          expect(res[0][0]).to.equal('Hello One World!');
          expect(res[0][1]).to.equal('Hello Another World!');
          done();
        })
        .catch(done);
    });

    it('should reject Promise on 404', function(done) {
      nock('http://some.org')
        .get('/url/123456')
        .reply(404, 'Not found');

      batchGetRequest('http://some.org/url/', '123456')
        .then(function() {
          done('should reject Promise');
        })
        .catch(function(err) {
          expect(err.message).to.equal('Request failed with status code 404');
          done();
        });
    });

    it('should do parametric request', function(done) {
      nock('http://google.com')
        .get('/123456/url')
        .reply(200, 'Hello World!');

      batchGetRequest('http://google.com/:id/url', {id: 123456})
        .then(function(res) {
          expect(res[0]).to.equal('Hello World!');
          done();
        })
        .catch(done);
    });

    it('should do parametric request with multiple ids', function(done) {
      nock('http://google.com')
        .get('/' + encodeURIComponent('0,1,2') + '/url')
        .reply(200, [
          'Hello World 0!',
          'Hello World 1!',
          'Hello World 2!'
        ]);

      batchGetRequest('http://google.com/:id/url', [{id: '0'}, {id: '1'}, {id: '2'}], {
        maxChunk: 10
      })
        .then(function(res) {
          expect(res[0]).to.equal('Hello World 0!');
          expect(res[1]).to.equal('Hello World 1!');
          expect(res[2]).to.equal('Hello World 2!');
          done();
        })
        .catch(done);
    });
  });

  describe('get request', function() {
    it('should request GET http://google.com/cat-poems/make-request and return Promise on successful response', function(done) {
      nock('http://google.com')
        .get('/cat-poems/make-request')
        .reply(200, 'The sun slants in, its light a wedge');

      getRequest('http://google.com/cat-poems/make-request')
        .then(function(res) {
          expect(res).to.equal('The sun slants in, its light a wedge');
          done();
        })
        .catch(done);
    });

    it('should retry on ECONNRESET', function(done) {
      var i = 4;
      while (--i >= 0) {
        nock('http://google.com')
          .get('/cat-poems/make-request-retry')
          .replyWithError({code: 'ECONNRESET', errno: 'ECONNRESET', syscall: 'read'});
      }

      nock('http://google.com')
        .get('/cat-poems/make-request-retry')
        .reply(200, 'Hello World!');

      getRequest('http://google.com/cat-poems/make-request-retry', {retry: 5, delayBeforeRetry: 0})
        .then(function(res) {
          expect(res).to.equal('Hello World!');
          done();
        })
        .catch(done);
    });

    it('should fail after number of retries is over', function(done) {
      var i = 5;
      while (--i >= 0) {
        nock('http://google.com')
          .get('/cat-poems/make-request-retry-fail')
          .replyWithError({code: 'ECONNRESET', errno: 'ECONNRESET', syscall: 'read'});
      }

      nock('http://google.com')
        .get('/cat-poems/make-request-retry-fail')
        .reply(200, 'Hello World!');

      getRequest('http://google.com/cat-poems/make-request-retry-fail', {retry: 5, delayBeforeRetry: 0})
        .then(function(res) {
          done('got result', res);
        })
        .catch(function(err) {
          expect(err.code).to.equal('ECONNRESET');
          done();
        });
    });
  });

  describe('batch post request', function() {
    it('should send single POST', function(done) {
      nock('http://google.com')
        .post('/cat-poems', 'Hello World')
        .reply(201);

      batchPostRequest('http://google.com/cat-poems', 'Hello World')
        .then(function() {
          done();
        })
        .catch(done);
    });

    it('should send multiple POST', function(done) {
      nock('http://google.com')
        .post('/cat-poems', 'The Owl and the Pussy-cat went to sea')
        .reply(201);

      nock('http://google.com')
        .post('/cat-poems', 'In a beautiful pea green boat,')
        .reply(201);

      batchPostRequest('http://google.com/cat-poems', [
        'The Owl and the Pussy-cat went to sea',
        'In a beautiful pea green boat,'
      ])
        .then(function() {
          done();
        })
        .catch(done);
    });
  });
});
