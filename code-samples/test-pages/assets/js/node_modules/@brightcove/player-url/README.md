# `@brightcove/player-url`

A module for getting a URL to a [Brightcove Player](https://support.brightcove.com/brightcove-player).

## Installation

```sh
npm install --save @brightcove/player-url
```

## Usage

To include `@brightcove/player-url` on your website or web application, use any of the following methods.

### ES Modules

When using in an ES modules-compatible environment or bundler like Rollup or webpack, install `@brightcove/player-url` via npm and `import` the plugin as you would any other module.

```js
import brightcovePlayerUrl from '@brightcove/player-url';

const myPlayerUrl = brightcovePlayerUrl({
  accountId: '1234567890',
  playerId: 'abc123xyz'
});

console.log(myPlayerUrl); // https://players.brightcove.net/1234567890/abc123xyz_default/index.min.js
```

### Browserify/CommonJS

When using with Browserify, install `@brightcove/player-url` via npm and `require` the plugin as you would any other module.

```js
var brightcovePlayerUrl = require('@brightcove/player-url');

var myPlayerUrl = brightcovePlayerUrl({
  accountId: '1234567890',
  playerId: 'abc123xyz'
});

console.log(myPlayerUrl); // https://players.brightcove.net/1234567890/abc123xyz_default/index.min.js
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['@brightcove/player-url'], function(brightcovePlayerUrl) {
  var myPlayerUrl = brightcovePlayerUrl({
    accountId: '1234567890',
    playerId: 'abc123xyz'
  });

  console.log(myPlayerUrl); // https://players.brightcove.net/1234567890/abc123xyz_default/index.min.js
});
```

### `<script>` Tag

This is the simplest case and least recommended. We expect most will bundle this module into an application or another module.

```html
<script src="//path/to/brightcove-player-url.min.js"></script>
<script>
  var myPlayerUrl = brightcovePlayerUrl({
    accountId: '1234567890',
    playerId: 'abc123xyz'
  });

  console.log(myPlayerUrl); // https://players.brightcove.net/1234567890/abc123xyz_default/index.min.js
</script>
```

## Parameters
This module takes the following parameters.

### `accountId`
**Required**
Type: `string`

A Brightcove account ID.

### `playerId`
Type: `string`
Default: `"default"`

A Brightcove player ID.

### `embedId`
Type: `string`
Default: `"default"`

A Brightcove player embed ID.

### `iframe`
Type: `boolean`
Default: `false`

Whether to return a URL for an HTML document to be embedded in an iframe.

### `minified`
Type: `boolean`
Default: `true`

When the `iframe` parameter is `false`, this can be used to control whether the minified or unminified JavaScript URL is returned.

### `base`
Type: `string`
Default: `"https://players.brightcove.net"`

A base CDN protocol and hostname. Mainly used for testing, but could have other uses. May have a trailing slash or not.

### `queryParams`
Type: `Object`
Default: `null`

When the `iframe` parameter is `true`, this can be used to add a query string to the URL with a whitelist of possible parameters:

- `adConfigId`: A playback token that specifies which SSAI configuration, CDN and DVR options to use for a Brightcove Live stream.
- `applicationId`: An application ID used to differentiate analytics across different uses of the same player.
- `catalogSearch`: A Video Cloud catalog search to perform.
- `catalogSequence`: A Video Cloud catalog sequence used to populate a playlist.
- `playlistId`: A Video Cloud playlist ID to load.
- `playlistVideoId`: A video ID at which to begin Video Cloud playlist playback.
- `videoId`: A Video Cloud video ID to load.

## License

Apache-2.0. Copyright (c) Brightcove, Inc.
