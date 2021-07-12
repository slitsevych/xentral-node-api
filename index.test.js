const assert = require('assert');
const XentralAPI = require('./');

describe('XentralAPI', () => {
  it('should throw if required config is missing', () => {
    assert.throws(() => XentralAPI(), /Missing parameters: url, user, pass/);
  });

  it('should throw if some of required config options are missing ', () => {
    assert.throws(() => XentralAPI({url: 'https://test.example'}), /Missing parameters: user, pass/);
    assert.throws(() => XentralAPI({url: 'https://test.example', user: 'test'}), /Missing parameter: pass/);
  });
});
