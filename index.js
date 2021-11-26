const axios = require('axios').default;
const _ = require('lodash');
const pkg = require('./package');
const digest = require('./digest');

const rejectMissingEndpoint = () => Promise.reject(new Error('Missing endpoint'));
const rejectMissingData = () => Promise.reject(new Error('Missing data'));
const rejectWrongApi = (apis) => Promise.reject(new Error(`Wrong API call, must be one of ${apis}`));
const rejectWrongType = (types) => Promise.reject(new Error(`Wrong API call, must be one of ${types}`));

// Turn ['val1', 'val2'] into '"val1", "val2"'
function list(vals) {
  return vals.map((v) => `"${v}"`).join(', ');
}

function isAuthError(err) {
  return _.get(err, 'response.status') === 401 && _.get(err.response, 'headers.www-authenticate', '').includes('nonce');
}

const USER_AGENT = `${pkg.name} ${pkg.version}`;

// Supported APIs
const REST = 'rest';
const STANDARD = 'standard';
const apis = [REST, STANDARD];
const apisAllowed = list(apis);

// Supported content types
const JSON = 'json';
const XML = 'xml';
const types = [JSON, XML];
const typesAllowed = list(types);

module.exports = ({url = '', user = '', pass = '', version = 'v1'} = {}) => {
  if (!url || !user || !pass) {
    const missing = _.keys(_.pickBy({url, user, pass}, _.negate(_.identity)));
    throw new Error(`Missing parameter${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`);
  }

  // api = 'rest' (REST-API) or 'standard' (Standard-API)
  // type = 'json' or 'xml'
  function _request({method, endpoint, params, data, api = REST, type = JSON}) {
    if (!apis.includes(api)) {
      return rejectWrongApi(apisAllowed);
    }

    if (!types.includes(type)) {
      return rejectWrongType(typesAllowed);
    }

    if (['POST', 'PUT'].includes(method) && _.isEmpty(data)) {
      return rejectMissingData();
    }

    if (_.isEmpty(endpoint)) {
      return rejectMissingEndpoint();
    }

    // Include api version only if required
    // Standard-API methods i.e.: LieferscheinCreate are not versioned
    // Only REST-API endpoints are versioned
    const v = api === REST ? `/${version}` : ``;
    const opts = {
      method,
      url: `${url}/api${v}/${endpoint}`,
      params,
      headers: {
        'Content-Type': `application/${type}; charset=utf-8`,
        'User-Agent': USER_AGENT
      },
      data
    };

    return axios(opts)
      // Handle digest auth
      .catch((err) => {
        if (isAuthError(err)) {
          const authHeader = err.response.headers['www-authenticate'];
          const authorization = digest(user, pass, opts.method, err.request.path, authHeader);
          return axios(_.merge({}, opts, {headers: {authorization}}));
        }
        // No digest auth error, continue
        throw err;
      });
  }

  return {
    get(endpoint, params = {}, api, type) {
      return _request({endpoint, method: 'GET', params, api, type});
    },

    post(endpoint, data, api, type) {
      return _request({endpoint, method: 'POST', data, api, type});
    },

    put(endpoint, data = {}) {
      return _request({endpoint, method: 'PUT', data});
    },

    del(endpoint) {
      return _request({endpoint, method: 'DELETE'});
    }
  };
};
