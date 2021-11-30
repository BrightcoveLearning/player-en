const tap = require('tap');
const tsml = require('tsml');
const bcpUrl = require('../dist/brightcove-player-url.cjs.js');

tap.test('param: accountId', (t) => {
  const basic = bcpUrl({accountId: '1'});
  const encoded = bcpUrl({accountId: '1 2'});

  t.equal(basic, 'https://players.brightcove.net/1/default_default/index.min.js');
  t.equal(encoded, 'https://players.brightcove.net/1%202/default_default/index.min.js');
  t.end();
});

tap.test('param: base', (t) => {
  const basic = bcpUrl({accountId: '1', base: 'foo'});
  const trailingSlash = bcpUrl({accountId: '1', base: 'bar/'});

  t.equal(basic, 'foo/1/default_default/index.min.js');
  t.equal(trailingSlash, 'bar/1/default_default/index.min.js');
  t.end();
});

tap.test('param: playerId', (t) => {
  const basic = bcpUrl({accountId: '1', playerId: 'foo'});
  const encoded = bcpUrl({accountId: '1', playerId: 'foo bar'});

  t.equal(basic, 'https://players.brightcove.net/1/foo_default/index.min.js');
  t.equal(encoded, 'https://players.brightcove.net/1/foo%20bar_default/index.min.js');
  t.end();
});

tap.test('param: embedId', (t) => {
  const basic = bcpUrl({accountId: '1', embedId: 'foo'});
  const encoded = bcpUrl({accountId: '1', embedId: 'foo bar'});

  t.equal(basic, 'https://players.brightcove.net/1/default_foo/index.min.js');
  t.equal(encoded, 'https://players.brightcove.net/1/default_foo%20bar/index.min.js');
  t.end();
});

tap.test('param: minified', (t) => {
  const notMinified = bcpUrl({accountId: '1', minified: false});
  const minified = bcpUrl({accountId: '1', minified: true});

  t.equal(notMinified, 'https://players.brightcove.net/1/default_default/index.js');
  t.equal(minified, 'https://players.brightcove.net/1/default_default/index.min.js');
  t.end();
});

tap.test('param: iframe', (t) => {
  const iframe = bcpUrl({accountId: '1', iframe: true});
  const iframeNotMinified = bcpUrl({accountId: '1', iframe: true, minified: false});
  const iframeMinified = bcpUrl({accountId: '1', iframe: true, minified: true});

  t.equal(iframe, 'https://players.brightcove.net/1/default_default/index.html');
  t.equal(iframeNotMinified, 'https://players.brightcove.net/1/default_default/index.html');
  t.equal(iframeMinified, 'https://players.brightcove.net/1/default_default/index.html');
  t.end();
});

tap.test('param: queryParams', (t) => {
  const empty = bcpUrl({accountId: '1', iframe: true, queryParams: {}});
  const unknown = bcpUrl({accountId: '1', iframe: true, queryParams: {foo: 'bar'}});
  const inPage = bcpUrl({accountId: '1', iframe: false, queryParams: {videoId: '123'}});

  const all = bcpUrl({
    accountId: '1',
    iframe: true,
    queryParams: {
      adConfigId: 'a c',
      applicationId: 'a a',
      catalogSearch: 'b',
      catalogSequence: 'c',
      playlistId: 'd',
      playlistVideoId: 'e',
      videoId: 'f',
      ignored: 'NOPE'
    }
  });

  const json = bcpUrl({
    accountId: '1',
    iframe: true,
    queryParams: {
      adConfigId: { ac: 1 },
      applicationId: {a: 1},
      catalogSearch: {b: 2},
      catalogSequence: {c: 3},
      playlistId: {d: 4},
      playlistVideoId: {e: 5},
      videoId: {f: 6}
    }
  });

  t.equal(empty, 'https://players.brightcove.net/1/default_default/index.html');
  t.equal(unknown, 'https://players.brightcove.net/1/default_default/index.html');
  t.equal(inPage, 'https://players.brightcove.net/1/default_default/index.min.js');

  t.equal(all, tsml`
    https://players.brightcove.net/1/default_default/index.html
      ?adConfigId=a%20c
      &applicationId=a%20a
      &catalogSearch=b
      &catalogSequence=c
      &playlistId=d
      &playlistVideoId=e
      &videoId=f`);

  t.equal(json, tsml`
    https://players.brightcove.net/1/default_default/index.html
      ?adConfigId=%5Bobject%20Object%5D
      &applicationId=%5Bobject%20Object%5D
      &catalogSearch=%7B%22b%22%3A2%7D
      &catalogSequence=%7B%22c%22%3A3%7D
      &playlistId=%5Bobject%20Object%5D
      &playlistVideoId=%5Bobject%20Object%5D
      &videoId=%5Bobject%20Object%5D`);

  t.done();
});
