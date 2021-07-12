const Promise = require('bluebird');
const request = require('request-promise');
const _ = require('lodash');

const rejectMissingUrl = () => Promise.reject(new Error('Missing url'));
const rejectMissingBody = () => Promise.reject(new Error('Missing body'));

module.exports = ({url = '', user = '', pass = '', version = 'v1'} = {}) => {

  if (!url || !user || !pass) {
    const missing = _.keys(_.pickBy({url, user, pass}, _.negate(_.identity)));
    throw new Error(`Missing parameter${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`);
  }

  function _request(args) {
    return request.defaults({
      baseUrl: `${url}/api/${version}`,
      json: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      auth: {
        user,
        pass,
        sendImmediately: false
      }
    })(args).promise();
  }

  return {
    get(url, qs = {}) {
      if (_.isEmpty(url)) {
        return rejectMissingUrl();
      }

      console.log(url);
      return _request({url, method: 'GET', qs});
    },

    post(url, body) {
      if (_.isEmpty(url)) {
        return rejectMissingUrl();
      }

      if (_.isEmpty(body)) {
        return rejectMissingBody();
      }

      return _request({url, method: 'POST', body, json: true});
    },

    put(url, body = {}) {
      if (_.isEmpty(url)) {
        return rejectMissingUrl();
      }

      return _request({url, method: 'PUT', body, json: true});
    },

    del(url) {
      if (_.isEmpty(url)) {
        return rejectMissingUrl();
      }

      return _request({url, method: 'DELETE'});
    }
  };
};
