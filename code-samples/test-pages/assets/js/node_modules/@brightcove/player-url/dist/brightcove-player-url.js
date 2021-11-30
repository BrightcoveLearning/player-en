/*! @name @brightcove/player-url @version 1.2.0 @license Apache-2.0 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.brightcovePlayerUrl = factory());
}(this, (function () { 'use strict';

  var version = "1.2.0";

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  // The parameters that may include JSON.
  var JSON_ALLOWED_PARAMS = ['catalogSearch', 'catalogSequence'];

  // The parameters that may be set as query string parameters for iframes.
  var IFRAME_ALLOWED_QUERY_PARAMS = ['adConfigId', 'applicationId', 'catalogSearch', 'catalogSequence', 'playlistId', 'playlistVideoId', 'videoId'];

  /**
   * Gets the value of a parameter and encodes it as a string.
   *
   * For certain keys, JSON is allowed and will be encoded.
   *
   * @private
   * @param   {Object} params
   *          A parameters object. See README for details.
   *
   * @param   {string} key
   *          The key in the params object.
   *
   * @return  {string|undefined}
   *          The encoded value - or `undefined` if none.
   */
  var getQueryParamValue = function getQueryParamValue(params, key) {

    if (!params || params[key] === undefined) {
      return;
    }

    // If it's not a string, such as with a catalog search or sequence, we
    // try to encode it as JSON.
    if (typeof params[key] !== 'string' && JSON_ALLOWED_PARAMS.indexOf(key) !== -1) {
      try {
        return encodeURIComponent(JSON.stringify(params[key]));
      } catch (x) {

        // If it's not a string and we can't encode as JSON, it's ignored entirely.
        return;
      }
    }

    return encodeURIComponent(String(params[key]).trim()) || undefined;
  };

  /**
   * In some cases, we need to add query string parameters to an iframe URL.
   *
   * @private
   * @param   {Object} params
   *          An object of query parameters.
   *
   * @return  {string}
   *          A query string starting with `?`. If no valid parameters are given,
   *          returns an empty string.
   */
  var getQueryString = function getQueryString(params) {
    return Object.keys(params).filter(function (k) {
      return IFRAME_ALLOWED_QUERY_PARAMS.indexOf(k) !== -1;
    }).reduce(function (qs, k) {
      var value = getQueryParamValue(params, k);

      if (value !== undefined) {
        qs += qs ? '&' : '?';
        qs += encodeURIComponent(k) + '=' + value;
      }

      return qs;
    }, '');
  };

  /**
   * Generate a URL to a Brightcove Player.
   *
   * @param  {Object}  params
   *         A set of parameters describing the player URL to create.
   *
   * @param  {string}  params.accountId
   *         A Brightcove account ID.
   *
   * @param  {string}  [params.playerId="default"]
   *         A Brightcove player ID.
   *
   * @param  {string}  [params.embedId="default"]
   *         A Brightcove player embed ID.
   *
   * @param  {boolean} [params.iframe=false]
   *         Whether to return a URL for an HTML document to be embedded in
   *         an iframe.
   *
   * @param  {boolean} [params.minified=true]
   *         When the `iframe` argument is `false`, this can be used to control
   *         whether the minified or unminified JavaScript URL is returned.
   *
   * @param  {string} [params.base="https://players.brightcove.net"]
   *         A base CDN protocol and hostname. Mainly used for testing.
   *
   * @return {string}
   *         A URL to a Brightcove Player.
   */
  var brightcovePlayerUrl = function brightcovePlayerUrl(_ref) {
    var accountId = _ref.accountId,
        _ref$base = _ref.base,
        base = _ref$base === undefined ? 'https://players.brightcove.net' : _ref$base,
        _ref$playerId = _ref.playerId,
        playerId = _ref$playerId === undefined ? 'default' : _ref$playerId,
        _ref$embedId = _ref.embedId,
        embedId = _ref$embedId === undefined ? 'default' : _ref$embedId,
        _ref$iframe = _ref.iframe,
        iframe = _ref$iframe === undefined ? false : _ref$iframe,
        _ref$minified = _ref.minified,
        minified = _ref$minified === undefined ? true : _ref$minified,
        _ref$queryParams = _ref.queryParams,
        queryParams = _ref$queryParams === undefined ? null : _ref$queryParams;

    var ext = '';

    if (iframe) {
      ext += 'html';
    } else {
      if (minified) {
        ext += 'min.';
      }
      ext += 'js';
    }

    if (base.charAt(base.length - 1) === '/') {
      base = base.substring(0, base.length - 1);
    }

    var qs = '';

    if (iframe && queryParams && (typeof queryParams === 'undefined' ? 'undefined' : _typeof(queryParams)) === 'object') {
      qs = getQueryString(queryParams);
    }

    accountId = encodeURIComponent(accountId);
    playerId = encodeURIComponent(playerId);
    embedId = encodeURIComponent(embedId);

    return base + '/' + accountId + '/' + playerId + '_' + embedId + '/index.' + ext + qs;
  };

  /**
   * The version of this module.
   *
   * @type {string}
   */
  brightcovePlayerUrl.VERSION = version;

  return brightcovePlayerUrl;

})));
