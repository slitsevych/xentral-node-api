# xentral node api

- [REST-API docs](https://update.xentral.biz/apidoc/docs211.html)
- [Standard-Api docs](https://help.xentral.com/hc/de/articles/360017436919-API-Dokumentation)

## Usage

```js
const xentral = require('xentral-node-api')({
  url: 'https://your-api-url.example',
  user: 'your-api-username',
  pass: 'your-api-password'
});

// Request orders
const res = await xentral.get('belege/auftraege');
```

## Options

`Xentral(url, user, pass, version = 'v1')`

- `url` **required**, string - Url of your Xentral API
- `user` **required**, string - User of your Xentral API
- `pass` **required**, string - Password of your Xentral API
- `version` optional, string - API version - example: `'v1'` (default)

## Examples

### get

`xentral.get(endpoint, params)`

- `endpoint` **required**, string example: `'belege/auftrage'`
- `params` optional, object example: `{include: 'positionen'}` - will serialize to `?include=positionen`
- `api` optional, string example: either `'rest'` (default) or `'standard'`
- `type` optional, string example: either `'json'` (default) or `'xml'`

---

```js
const res = await xentral.get('belege/auftraege', {include: 'positionen'});
```

---

### post

`xentral.post(endpoint, data, api, type)`

- `endpoint` **required**, string example: `'trackingnummern'`
- `data` optional, object example: `{key: 'value'}`
- `api` optional, string example: either `'rest'` (default) or `'standard'`
- `type` optional, string example: either `'json'` (default) or `'xml'`

---

```js
// Using default api 'rest' and type 'json'
const res = await xentral.post('trackingnummern', {
  tracking: 'Test-tracking-123i12937',
  auftrag: '200001',
  anzahlpakete: 1,
  gewicht: 0.1,
  versendet_am: '2021-11-23'
});

// Using api 'standard' and type 'xml'
const xml = `<xml>
  <nummer>7000004</nummer>
  <lager_platz>HL001B</lager_platz>
  <lager_menge>22</lager_menge>
</xml>`;

const res = await xentral.post('ArtikelEdit', xml, 'standard', 'xml');

// Using api 'standard' and default type 'json'
const data = {
  nummer: 7000004,
  lager_platz: 'HL001B',
  lager_menge: 22
};

const res = await xentral.post('ArtikelEdit', data, 'standard');
```

---

### put

`xentral.put(endpoint, data)`

- `endpoint` **required**, string example: `'trackingnummern'`
- `params` optional, object example: `{include: 'positionen'}`

---

```js
const data = {
  tracking: 'Test-tracking-123i12937',
  versendet_am: '2021-11-23',
  anzahlpakete: 2
};

const res = await xentral.put('trackingnummern', data);
```

---

### del

`xentral.del(endpoint)`

- `endpoint` **required**, string example: `'adressen/10'`

---

```js
const res = await xentral.del('adressen/10');
```

---

Author: Denis Ciccale

Liecense: https://denis.mit-license.org/
