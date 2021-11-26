const crypto = require('crypto');

let count = 0;

function parseAuthDetails(authHeader) {
  const entries = authHeader
  .replace('Digest ', '')
  .split(',')
  .map((kv) => {
    const [key, value] = kv.split('=');
    return [key, value.replace(/"/g, '')];
  });
  return Object.fromEntries(entries);
}

function md5(val) {
  return crypto
    .createHash('md5')
    .update(val)
    .digest('hex');
}

module.exports = (user, pass, method, path, authHeader) => {
  count += 1;
  const nonceCount = `00000000${count}`.slice(-8);
  const {realm, nonce, opaque} = parseAuthDetails(authHeader);

  const ha1 = md5(`${user}:${realm}:${pass}`);
  const ha2 = md5(`${method}:${path}`);
  const cnonce = crypto.randomBytes(24).toString('hex');
  const response = md5(`${ha1}:${nonce}:${nonceCount}:${cnonce}:auth:${ha2}`);

  // Construct authorization header
  return `Digest username="${user}",realm="${realm}",` +
  `nonce="${nonce}",uri="${path}",qop=auth,` +
  `response="${response}",nc="${nonceCount}",cnonce="${cnonce}",opaque="${opaque}"`;
};
