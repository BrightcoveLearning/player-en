/*! @name @brightcove/player-loader @version 1.8.0 @license Apache-2.0 */
(function (QUnit) {
	'use strict';

	QUnit = QUnit && QUnit.hasOwnProperty('default') ? QUnit['default'] : QUnit;

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var minDoc = {};

	var topLevel = typeof commonjsGlobal !== 'undefined' ? commonjsGlobal :
	    typeof window !== 'undefined' ? window : {};


	var doccy;

	if (typeof document !== 'undefined') {
	    doccy = document;
	} else {
	    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

	    if (!doccy) {
	        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
	    }
	}

	var document_1 = doccy;

	function _extends() {
	  _extends = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends.apply(this, arguments);
	}

	/*! @name @brightcove/player-url @version 1.2.0 @license Apache-2.0 */
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

	var win;

	if (typeof window !== "undefined") {
	    win = window;
	} else if (typeof commonjsGlobal !== "undefined") {
	    win = commonjsGlobal;
	} else if (typeof self !== "undefined"){
	    win = self;
	} else {
	    win = {};
	}

	var window_1 = win;

	var cov_2iqe71ebne = function () {
	  var path = '/Users/poneill/dev/player-loader/src/constants.js',
	      hash = '1dff08da71b9e2ba10f7386f54bbdfb5e9eee293',
	      Function = function () {}.constructor,
	      global = new Function('return this')(),
	      gcv = '__coverage__',
	      coverageData = {
	    path: '/Users/poneill/dev/player-loader/src/constants.js',
	    statementMap: {
	      '0': {
	        start: {
	          line: 3,
	          column: 17
	        },
	        end: {
	          line: 9,
	          column: 1
	        }
	      },
	      '1': {
	        start: {
	          line: 11,
	          column: 29
	        },
	        end: {
	          line: 11,
	          column: 35
	        }
	      },
	      '2': {
	        start: {
	          line: 12,
	          column: 43
	        },
	        end: {
	          line: 12,
	          column: 48
	        }
	      },
	      '3': {
	        start: {
	          line: 13,
	          column: 26
	        },
	        end: {
	          line: 13,
	          column: 32
	        }
	      },
	      '4': {
	        start: {
	          line: 15,
	          column: 29
	        },
	        end: {
	          line: 15,
	          column: 36
	        }
	      },
	      '5': {
	        start: {
	          line: 16,
	          column: 31
	        },
	        end: {
	          line: 16,
	          column: 41
	        }
	      },
	      '6': {
	        start: {
	          line: 18,
	          column: 27
	        },
	        end: {
	          line: 18,
	          column: 36
	        }
	      },
	      '7': {
	        start: {
	          line: 19,
	          column: 26
	        },
	        end: {
	          line: 19,
	          column: 34
	        }
	      },
	      '8': {
	        start: {
	          line: 21,
	          column: 31
	        },
	        end: {
	          line: 21,
	          column: 39
	        }
	      },
	      '9': {
	        start: {
	          line: 22,
	          column: 32
	        },
	        end: {
	          line: 22,
	          column: 41
	        }
	      },
	      '10': {
	        start: {
	          line: 23,
	          column: 31
	        },
	        end: {
	          line: 23,
	          column: 39
	        }
	      },
	      '11': {
	        start: {
	          line: 24,
	          column: 30
	        },
	        end: {
	          line: 24,
	          column: 37
	        }
	      },
	      '12': {
	        start: {
	          line: 25,
	          column: 32
	        },
	        end: {
	          line: 25,
	          column: 41
	        }
	      },
	      '13': {
	        start: {
	          line: 27,
	          column: 27
	        },
	        end: {
	          line: 27,
	          column: 63
	        }
	      }
	    },
	    fnMap: {},
	    branchMap: {},
	    s: {
	      '0': 0,
	      '1': 0,
	      '2': 0,
	      '3': 0,
	      '4': 0,
	      '5': 0,
	      '6': 0,
	      '7': 0,
	      '8': 0,
	      '9': 0,
	      '10': 0,
	      '11': 0,
	      '12': 0,
	      '13': 0
	    },
	    f: {},
	    b: {},
	    _coverageSchema: '332fd63041d2c1bcb487cc26dd0d5f7d97098a6c'
	  },
	      coverage = global[gcv] || (global[gcv] = {});

	  if (coverage[path] && coverage[path].hash === hash) {
	    return coverage[path];
	  }

	  coverageData.hash = hash;
	  return coverage[path] = coverageData;
	}();
	var DEFAULTS = (cov_2iqe71ebne.s[0]++, {
	  embedId: 'default',
	  embedType: 'in-page',
	  playerId: 'default',
	  Promise: window_1.Promise,
	  refNodeInsert: 'append'
	});
	var DEFAULT_ASPECT_RATIO = (cov_2iqe71ebne.s[1]++, '16:9');
	var DEFAULT_IFRAME_HORIZONTAL_PLAYLIST = (cov_2iqe71ebne.s[2]++, false);
	var DEFAULT_MAX_WIDTH = (cov_2iqe71ebne.s[3]++, '100%');
	var EMBED_TAG_NAME_VIDEO = (cov_2iqe71ebne.s[4]++, 'video');
	var EMBED_TAG_NAME_VIDEOJS = (cov_2iqe71ebne.s[5]++, 'video-js');
	var EMBED_TYPE_IN_PAGE = (cov_2iqe71ebne.s[6]++, 'in-page');
	var EMBED_TYPE_IFRAME = (cov_2iqe71ebne.s[7]++, 'iframe');
	var REF_NODE_INSERT_APPEND = (cov_2iqe71ebne.s[8]++, 'append');
	var REF_NODE_INSERT_PREPEND = (cov_2iqe71ebne.s[9]++, 'prepend');
	var REF_NODE_INSERT_BEFORE = (cov_2iqe71ebne.s[10]++, 'before');
	var REF_NODE_INSERT_AFTER = (cov_2iqe71ebne.s[11]++, 'after');
	var REF_NODE_INSERT_REPLACE = (cov_2iqe71ebne.s[12]++, 'replace');
	var JSON_ALLOWED_ATTRS = (cov_2iqe71ebne.s[13]++, ['catalogSearch', 'catalogSequence']);

	var cov_2m5pdyp79v = function () {
	  var path = '/Users/poneill/dev/player-loader/src/urls.js',
	      hash = 'bed0fbde72a8278c733c22db52a13de35bf7ec22',
	      Function = function () {}.constructor,
	      global = new Function('return this')(),
	      gcv = '__coverage__',
	      coverageData = {
	    path: '/Users/poneill/dev/player-loader/src/urls.js',
	    statementMap: {
	      '0': {
	        start: {
	          line: 4,
	          column: 15
	        },
	        end: {
	          line: 4,
	          column: 48
	        }
	      },
	      '1': {
	        start: {
	          line: 16,
	          column: 15
	        },
	        end: {
	          line: 41,
	          column: 1
	        }
	      },
	      '2': {
	        start: {
	          line: 18,
	          column: 2
	        },
	        end: {
	          line: 20,
	          column: 3
	        }
	      },
	      '3': {
	        start: {
	          line: 19,
	          column: 4
	        },
	        end: {
	          line: 19,
	          column: 28
	        }
	      },
	      '4': {
	        start: {
	          line: 22,
	          column: 55
	        },
	        end: {
	          line: 22,
	          column: 61
	        }
	      },
	      '5': {
	        start: {
	          line: 23,
	          column: 17
	        },
	        end: {
	          line: 23,
	          column: 55
	        }
	      },
	      '6': {
	        start: {
	          line: 25,
	          column: 2
	        },
	        end: {
	          line: 40,
	          column: 5
	        }
	      },
	      '7': {
	        start: {
	          line: 50,
	          column: 19
	        },
	        end: {
	          line: 50,
	          column: 33
	        }
	      },
	      '8': {
	        start: {
	          line: 50,
	          column: 25
	        },
	        end: {
	          line: 50,
	          column: 33
	        }
	      },
	      '9': {
	        start: {
	          line: 59,
	          column: 19
	        },
	        end: {
	          line: 61,
	          column: 1
	        }
	      },
	      '10': {
	        start: {
	          line: 60,
	          column: 2
	        },
	        end: {
	          line: 60,
	          column: 21
	        }
	      }
	    },
	    fnMap: {
	      '0': {
	        name: '(anonymous_0)',
	        decl: {
	          start: {
	            line: 16,
	            column: 15
	          },
	          end: {
	            line: 16,
	            column: 16
	          }
	        },
	        loc: {
	          start: {
	            line: 16,
	            column: 27
	          },
	          end: {
	            line: 41,
	            column: 1
	          }
	        },
	        line: 16
	      },
	      '1': {
	        name: '(anonymous_1)',
	        decl: {
	          start: {
	            line: 50,
	            column: 19
	          },
	          end: {
	            line: 50,
	            column: 20
	          }
	        },
	        loc: {
	          start: {
	            line: 50,
	            column: 25
	          },
	          end: {
	            line: 50,
	            column: 33
	          }
	        },
	        line: 50
	      },
	      '2': {
	        name: '(anonymous_2)',
	        decl: {
	          start: {
	            line: 59,
	            column: 19
	          },
	          end: {
	            line: 59,
	            column: 20
	          }
	        },
	        loc: {
	          start: {
	            line: 59,
	            column: 32
	          },
	          end: {
	            line: 61,
	            column: 1
	          }
	        },
	        line: 59
	      }
	    },
	    branchMap: {
	      '0': {
	        loc: {
	          start: {
	            line: 18,
	            column: 2
	          },
	          end: {
	            line: 20,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 18,
	            column: 2
	          },
	          end: {
	            line: 20,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 18,
	            column: 2
	          },
	          end: {
	            line: 20,
	            column: 3
	          }
	        }],
	        line: 18
	      },
	      '1': {
	        loc: {
	          start: {
	            line: 34,
	            column: 14
	          },
	          end: {
	            line: 34,
	            column: 60
	          }
	        },
	        type: 'cond-expr',
	        locations: [{
	          start: {
	            line: 34,
	            column: 29
	          },
	          end: {
	            line: 34,
	            column: 53
	          }
	        }, {
	          start: {
	            line: 34,
	            column: 56
	          },
	          end: {
	            line: 34,
	            column: 60
	          }
	        }],
	        line: 34
	      }
	    },
	    s: {
	      '0': 0,
	      '1': 0,
	      '2': 0,
	      '3': 0,
	      '4': 0,
	      '5': 0,
	      '6': 0,
	      '7': 0,
	      '8': 0,
	      '9': 0,
	      '10': 0
	    },
	    f: {
	      '0': 0,
	      '1': 0,
	      '2': 0
	    },
	    b: {
	      '0': [0, 0],
	      '1': [0, 0]
	    },
	    _coverageSchema: '332fd63041d2c1bcb487cc26dd0d5f7d97098a6c'
	  },
	      coverage = global[gcv] || (global[gcv] = {});

	  if (coverage[path] && coverage[path].hash === hash) {
	    return coverage[path];
	  }

	  coverageData.hash = hash;
	  return coverage[path] = coverageData;
	}();
	var BASE_URL = (cov_2m5pdyp79v.s[0]++, 'https://players.brightcove.net/');
	cov_2m5pdyp79v.s[1]++;

	var getUrl = function getUrl(params) {
	  cov_2m5pdyp79v.f[0]++;
	  cov_2m5pdyp79v.s[2]++;

	  if (params.playerUrl) {
	    cov_2m5pdyp79v.b[0][0]++;
	    cov_2m5pdyp79v.s[3]++;
	    return params.playerUrl;
	  } else {
	    cov_2m5pdyp79v.b[0][1]++;
	  }

	  var _ref = (cov_2m5pdyp79v.s[4]++, params),
	      accountId = _ref.accountId,
	      playerId = _ref.playerId,
	      embedId = _ref.embedId,
	      embedOptions = _ref.embedOptions;

	  var iframe = (cov_2m5pdyp79v.s[5]++, params.embedType === EMBED_TYPE_IFRAME);
	  cov_2m5pdyp79v.s[6]++;
	  return brightcovePlayerUrl({
	    accountId: accountId,
	    playerId: playerId,
	    embedId: embedId,
	    iframe: iframe,
	    base: BASE_URL,
	    minified: embedOptions ? (cov_2m5pdyp79v.b[1][0]++, !embedOptions.unminified) : (cov_2m5pdyp79v.b[1][1]++, true),
	    queryParams: params
	  });
	};

	cov_2m5pdyp79v.s[7]++;

	var getBaseUrl = function getBaseUrl() {
	  cov_2m5pdyp79v.f[1]++;
	  cov_2m5pdyp79v.s[8]++;
	  return BASE_URL;
	};

	cov_2m5pdyp79v.s[9]++;

	var setBaseUrl = function setBaseUrl(baseUrl) {
	  cov_2m5pdyp79v.f[2]++;
	  cov_2m5pdyp79v.s[10]++;
	  BASE_URL = baseUrl;
	};

	var urls = {
	  getUrl: getUrl,
	  getBaseUrl: getBaseUrl,
	  setBaseUrl: setBaseUrl
	};

	var cov_20bjz8jx2s = function () {
	  var path = '/Users/poneill/dev/player-loader/src/create-embed.js',
	      hash = 'a44fc58e9031afad90b3faa7d4c5b3c874bc4a50',
	      Function = function () {}.constructor,
	      global = new Function('return this')(),
	      gcv = '__coverage__',
	      coverageData = {
	    path: '/Users/poneill/dev/player-loader/src/create-embed.js',
	    statementMap: {
	      '0': {
	        start: {
	          line: 26,
	          column: 13
	        },
	        end: {
	          line: 26,
	          column: 53
	        }
	      },
	      '1': {
	        start: {
	          line: 26,
	          column: 21
	        },
	        end: {
	          line: 26,
	          column: 53
	        }
	      },
	      '2': {
	        start: {
	          line: 37,
	          column: 18
	        },
	        end: {
	          line: 37,
	          column: 60
	        }
	      },
	      '3': {
	        start: {
	          line: 37,
	          column: 26
	        },
	        end: {
	          line: 37,
	          column: 60
	        }
	      },
	      '4': {
	        start: {
	          line: 49,
	          column: 26
	        },
	        end: {
	          line: 57,
	          column: 1
	        }
	      },
	      '5': {
	        start: {
	          line: 50,
	          column: 13
	        },
	        end: {
	          line: 50,
	          column: 45
	        }
	      },
	      '6': {
	        start: {
	          line: 52,
	          column: 2
	        },
	        end: {
	          line: 52,
	          column: 66
	        }
	      },
	      '7': {
	        start: {
	          line: 53,
	          column: 2
	        },
	        end: {
	          line: 53,
	          column: 56
	        }
	      },
	      '8': {
	        start: {
	          line: 54,
	          column: 2
	        },
	        end: {
	          line: 54,
	          column: 31
	        }
	      },
	      '9': {
	        start: {
	          line: 56,
	          column: 2
	        },
	        end: {
	          line: 56,
	          column: 12
	        }
	      },
	      '10': {
	        start: {
	          line: 69,
	          column: 26
	        },
	        end: {
	          line: 115,
	          column: 1
	        }
	      },
	      '11': {
	        start: {
	          line: 70,
	          column: 25
	        },
	        end: {
	          line: 70,
	          column: 31
	        }
	      },
	      '12': {
	        start: {
	          line: 74,
	          column: 24
	        },
	        end: {
	          line: 84,
	          column: 3
	        }
	      },
	      '13': {
	        start: {
	          line: 86,
	          column: 18
	        },
	        end: {
	          line: 86,
	          column: 80
	        }
	      },
	      '14': {
	        start: {
	          line: 87,
	          column: 13
	        },
	        end: {
	          line: 87,
	          column: 44
	        }
	      },
	      '15': {
	        start: {
	          line: 89,
	          column: 2
	        },
	        end: {
	          line: 109,
	          column: 7
	        }
	      },
	      '16': {
	        start: {
	          line: 90,
	          column: 19
	        },
	        end: {
	          line: 90,
	          column: 30
	        }
	      },
	      '17': {
	        start: {
	          line: 96,
	          column: 6
	        },
	        end: {
	          line: 106,
	          column: 7
	        }
	      },
	      '18': {
	        start: {
	          line: 97,
	          column: 8
	        },
	        end: {
	          line: 103,
	          column: 9
	        }
	      },
	      '19': {
	        start: {
	          line: 98,
	          column: 10
	        },
	        end: {
	          line: 98,
	          column: 46
	        }
	      },
	      '20': {
	        start: {
	          line: 102,
	          column: 10
	        },
	        end: {
	          line: 102,
	          column: 17
	        }
	      },
	      '21': {
	        start: {
	          line: 105,
	          column: 8
	        },
	        end: {
	          line: 105,
	          column: 43
	        }
	      },
	      '22': {
	        start: {
	          line: 108,
	          column: 6
	        },
	        end: {
	          line: 108,
	          column: 49
	        }
	      },
	      '23': {
	        start: {
	          line: 111,
	          column: 2
	        },
	        end: {
	          line: 111,
	          column: 42
	        }
	      },
	      '24': {
	        start: {
	          line: 112,
	          column: 2
	        },
	        end: {
	          line: 112,
	          column: 31
	        }
	      },
	      '25': {
	        start: {
	          line: 114,
	          column: 2
	        },
	        end: {
	          line: 114,
	          column: 12
	        }
	      },
	      '26': {
	        start: {
	          line: 133,
	          column: 23
	        },
	        end: {
	          line: 176,
	          column: 1
	        }
	      },
	      '27': {
	        start: {
	          line: 134,
	          column: 2
	        },
	        end: {
	          line: 136,
	          column: 3
	        }
	      },
	      '28': {
	        start: {
	          line: 135,
	          column: 4
	        },
	        end: {
	          line: 135,
	          column: 14
	        }
	      },
	      '29': {
	        start: {
	          line: 138,
	          column: 2
	        },
	        end: {
	          line: 138,
	          column: 33
	        }
	      },
	      '30': {
	        start: {
	          line: 139,
	          column: 2
	        },
	        end: {
	          line: 139,
	          column: 23
	        }
	      },
	      '31': {
	        start: {
	          line: 140,
	          column: 2
	        },
	        end: {
	          line: 140,
	          column: 25
	        }
	      },
	      '32': {
	        start: {
	          line: 141,
	          column: 2
	        },
	        end: {
	          line: 141,
	          column: 26
	        }
	      },
	      '33': {
	        start: {
	          line: 142,
	          column: 2
	        },
	        end: {
	          line: 142,
	          column: 24
	        }
	      },
	      '34': {
	        start: {
	          line: 143,
	          column: 2
	        },
	        end: {
	          line: 143,
	          column: 26
	        }
	      },
	      '35': {
	        start: {
	          line: 144,
	          column: 2
	        },
	        end: {
	          line: 144,
	          column: 27
	        }
	      },
	      '36': {
	        start: {
	          line: 146,
	          column: 21
	        },
	        end: {
	          line: 150,
	          column: 29
	        }
	      },
	      '37': {
	        start: {
	          line: 154,
	          column: 22
	        },
	        end: {
	          line: 154,
	          column: 67
	        }
	      },
	      '38': {
	        start: {
	          line: 155,
	          column: 16
	        },
	        end: {
	          line: 155,
	          column: 45
	        }
	      },
	      '39': {
	        start: {
	          line: 156,
	          column: 20
	        },
	        end: {
	          line: 156,
	          column: 57
	        }
	      },
	      '40': {
	        start: {
	          line: 161,
	          column: 2
	        },
	        end: {
	          line: 163,
	          column: 3
	        }
	      },
	      '41': {
	        start: {
	          line: 162,
	          column: 4
	        },
	        end: {
	          line: 162,
	          column: 23
	        }
	      },
	      '42': {
	        start: {
	          line: 165,
	          column: 2
	        },
	        end: {
	          line: 165,
	          column: 44
	        }
	      },
	      '43': {
	        start: {
	          line: 166,
	          column: 2
	        },
	        end: {
	          line: 166,
	          column: 24
	        }
	      },
	      '44': {
	        start: {
	          line: 168,
	          column: 16
	        },
	        end: {
	          line: 168,
	          column: 45
	        }
	      },
	      '45': {
	        start: {
	          line: 170,
	          column: 2
	        },
	        end: {
	          line: 170,
	          column: 36
	        }
	      },
	      '46': {
	        start: {
	          line: 171,
	          column: 2
	        },
	        end: {
	          line: 171,
	          column: 32
	        }
	      },
	      '47': {
	        start: {
	          line: 172,
	          column: 2
	        },
	        end: {
	          line: 172,
	          column: 45
	        }
	      },
	      '48': {
	        start: {
	          line: 173,
	          column: 2
	        },
	        end: {
	          line: 173,
	          column: 27
	        }
	      },
	      '49': {
	        start: {
	          line: 175,
	          column: 2
	        },
	        end: {
	          line: 175,
	          column: 15
	        }
	      },
	      '50': {
	        start: {
	          line: 191,
	          column: 16
	        },
	        end: {
	          line: 202,
	          column: 1
	        }
	      },
	      '51': {
	        start: {
	          line: 192,
	          column: 2
	        },
	        end: {
	          line: 194,
	          column: 3
	        }
	      },
	      '52': {
	        start: {
	          line: 193,
	          column: 4
	        },
	        end: {
	          line: 193,
	          column: 14
	        }
	      },
	      '53': {
	        start: {
	          line: 196,
	          column: 14
	        },
	        end: {
	          line: 196,
	          column: 43
	        }
	      },
	      '54': {
	        start: {
	          line: 198,
	          column: 2
	        },
	        end: {
	          line: 198,
	          column: 41
	        }
	      },
	      '55': {
	        start: {
	          line: 199,
	          column: 2
	        },
	        end: {
	          line: 199,
	          column: 22
	        }
	      },
	      '56': {
	        start: {
	          line: 201,
	          column: 2
	        },
	        end: {
	          line: 201,
	          column: 13
	        }
	      },
	      '57': {
	        start: {
	          line: 221,
	          column: 18
	        },
	        end: {
	          line: 227,
	          column: 1
	        }
	      },
	      '58': {
	        start: {
	          line: 222,
	          column: 2
	        },
	        end: {
	          line: 224,
	          column: 3
	        }
	      },
	      '59': {
	        start: {
	          line: 223,
	          column: 4
	        },
	        end: {
	          line: 223,
	          column: 17
	        }
	      },
	      '60': {
	        start: {
	          line: 226,
	          column: 2
	        },
	        end: {
	          line: 226,
	          column: 79
	        }
	      },
	      '61': {
	        start: {
	          line: 242,
	          column: 20
	        },
	        end: {
	          line: 283,
	          column: 1
	        }
	      },
	      '62': {
	        start: {
	          line: 243,
	          column: 35
	        },
	        end: {
	          line: 243,
	          column: 41
	        }
	      },
	      '63': {
	        start: {
	          line: 244,
	          column: 24
	        },
	        end: {
	          line: 244,
	          column: 42
	        }
	      },
	      '64': {
	        start: {
	          line: 248,
	          column: 18
	        },
	        end: {
	          line: 248,
	          column: 73
	        }
	      },
	      '65': {
	        start: {
	          line: 251,
	          column: 2
	        },
	        end: {
	          line: 263,
	          column: 3
	        }
	      },
	      '66': {
	        start: {
	          line: 252,
	          column: 4
	        },
	        end: {
	          line: 252,
	          column: 49
	        }
	      },
	      '67': {
	        start: {
	          line: 253,
	          column: 9
	        },
	        end: {
	          line: 263,
	          column: 3
	        }
	      },
	      '68': {
	        start: {
	          line: 254,
	          column: 4
	        },
	        end: {
	          line: 254,
	          column: 76
	        }
	      },
	      '69': {
	        start: {
	          line: 255,
	          column: 9
	        },
	        end: {
	          line: 263,
	          column: 3
	        }
	      },
	      '70': {
	        start: {
	          line: 256,
	          column: 4
	        },
	        end: {
	          line: 256,
	          column: 49
	        }
	      },
	      '71': {
	        start: {
	          line: 257,
	          column: 9
	        },
	        end: {
	          line: 263,
	          column: 3
	        }
	      },
	      '72': {
	        start: {
	          line: 258,
	          column: 4
	        },
	        end: {
	          line: 258,
	          column: 62
	        }
	      },
	      '73': {
	        start: {
	          line: 262,
	          column: 4
	        },
	        end: {
	          line: 262,
	          column: 33
	        }
	      },
	      '74': {
	        start: {
	          line: 268,
	          column: 2
	        },
	        end: {
	          line: 274,
	          column: 3
	        }
	      },
	      '75': {
	        start: {
	          line: 269,
	          column: 28
	        },
	        end: {
	          line: 269,
	          column: 78
	        }
	      },
	      '76': {
	        start: {
	          line: 270,
	          column: 21
	        },
	        end: {
	          line: 270,
	          column: 60
	        }
	      },
	      '77': {
	        start: {
	          line: 272,
	          column: 4
	        },
	        end: {
	          line: 272,
	          column: 43
	        }
	      },
	      '78': {
	        start: {
	          line: 273,
	          column: 4
	        },
	        end: {
	          line: 273,
	          column: 78
	        }
	      },
	      '79': {
	        start: {
	          line: 279,
	          column: 2
	        },
	        end: {
	          line: 279,
	          column: 24
	        }
	      },
	      '80': {
	        start: {
	          line: 282,
	          column: 2
	        },
	        end: {
	          line: 282,
	          column: 15
	        }
	      },
	      '81': {
	        start: {
	          line: 298,
	          column: 23
	        },
	        end: {
	          line: 310,
	          column: 1
	        }
	      },
	      '82': {
	        start: {
	          line: 299,
	          column: 2
	        },
	        end: {
	          line: 301,
	          column: 3
	        }
	      },
	      '83': {
	        start: {
	          line: 300,
	          column: 4
	        },
	        end: {
	          line: 300,
	          column: 17
	        }
	      },
	      '84': {
	        start: {
	          line: 303,
	          column: 17
	        },
	        end: {
	          line: 303,
	          column: 45
	        }
	      },
	      '85': {
	        start: {
	          line: 305,
	          column: 2
	        },
	        end: {
	          line: 307,
	          column: 3
	        }
	      },
	      '86': {
	        start: {
	          line: 306,
	          column: 4
	        },
	        end: {
	          line: 306,
	          column: 18
	        }
	      },
	      '87': {
	        start: {
	          line: 309,
	          column: 2
	        },
	        end: {
	          line: 309,
	          column: 15
	        }
	      },
	      '88': {
	        start: {
	          line: 324,
	          column: 20
	        },
	        end: {
	          line: 330,
	          column: 1
	        }
	      },
	      '89': {
	        start: {
	          line: 325,
	          column: 16
	        },
	        end: {
	          line: 327,
	          column: 29
	        }
	      },
	      '90': {
	        start: {
	          line: 329,
	          column: 2
	        },
	        end: {
	          line: 329,
	          column: 60
	        }
	      }
	    },
	    fnMap: {
	      '0': {
	        name: '(anonymous_0)',
	        decl: {
	          start: {
	            line: 26,
	            column: 13
	          },
	          end: {
	            line: 26,
	            column: 14
	          }
	        },
	        loc: {
	          start: {
	            line: 26,
	            column: 21
	          },
	          end: {
	            line: 26,
	            column: 53
	          }
	        },
	        line: 26
	      },
	      '1': {
	        name: '(anonymous_1)',
	        decl: {
	          start: {
	            line: 37,
	            column: 18
	          },
	          end: {
	            line: 37,
	            column: 19
	          }
	        },
	        loc: {
	          start: {
	            line: 37,
	            column: 26
	          },
	          end: {
	            line: 37,
	            column: 60
	          }
	        },
	        line: 37
	      },
	      '2': {
	        name: '(anonymous_2)',
	        decl: {
	          start: {
	            line: 49,
	            column: 26
	          },
	          end: {
	            line: 49,
	            column: 27
	          }
	        },
	        loc: {
	          start: {
	            line: 49,
	            column: 38
	          },
	          end: {
	            line: 57,
	            column: 1
	          }
	        },
	        line: 49
	      },
	      '3': {
	        name: '(anonymous_3)',
	        decl: {
	          start: {
	            line: 69,
	            column: 26
	          },
	          end: {
	            line: 69,
	            column: 27
	          }
	        },
	        loc: {
	          start: {
	            line: 69,
	            column: 38
	          },
	          end: {
	            line: 115,
	            column: 1
	          }
	        },
	        line: 69
	      },
	      '4': {
	        name: '(anonymous_4)',
	        decl: {
	          start: {
	            line: 90,
	            column: 12
	          },
	          end: {
	            line: 90,
	            column: 13
	          }
	        },
	        loc: {
	          start: {
	            line: 90,
	            column: 19
	          },
	          end: {
	            line: 90,
	            column: 30
	          }
	        },
	        line: 90
	      },
	      '5': {
	        name: '(anonymous_5)',
	        decl: {
	          start: {
	            line: 91,
	            column: 13
	          },
	          end: {
	            line: 91,
	            column: 14
	          }
	        },
	        loc: {
	          start: {
	            line: 91,
	            column: 20
	          },
	          end: {
	            line: 109,
	            column: 5
	          }
	        },
	        line: 91
	      },
	      '6': {
	        name: '(anonymous_6)',
	        decl: {
	          start: {
	            line: 133,
	            column: 23
	          },
	          end: {
	            line: 133,
	            column: 24
	          }
	        },
	        loc: {
	          start: {
	            line: 133,
	            column: 56
	          },
	          end: {
	            line: 176,
	            column: 1
	          }
	        },
	        line: 133
	      },
	      '7': {
	        name: '(anonymous_7)',
	        decl: {
	          start: {
	            line: 191,
	            column: 16
	          },
	          end: {
	            line: 191,
	            column: 17
	          }
	        },
	        loc: {
	          start: {
	            line: 191,
	            column: 38
	          },
	          end: {
	            line: 202,
	            column: 1
	          }
	        },
	        line: 191
	      },
	      '8': {
	        name: '(anonymous_8)',
	        decl: {
	          start: {
	            line: 221,
	            column: 18
	          },
	          end: {
	            line: 221,
	            column: 19
	          }
	        },
	        loc: {
	          start: {
	            line: 221,
	            column: 54
	          },
	          end: {
	            line: 227,
	            column: 1
	          }
	        },
	        line: 221
	      },
	      '9': {
	        name: '(anonymous_9)',
	        decl: {
	          start: {
	            line: 242,
	            column: 20
	          },
	          end: {
	            line: 242,
	            column: 21
	          }
	        },
	        loc: {
	          start: {
	            line: 242,
	            column: 39
	          },
	          end: {
	            line: 283,
	            column: 1
	          }
	        },
	        line: 242
	      },
	      '10': {
	        name: '(anonymous_10)',
	        decl: {
	          start: {
	            line: 298,
	            column: 23
	          },
	          end: {
	            line: 298,
	            column: 24
	          }
	        },
	        loc: {
	          start: {
	            line: 298,
	            column: 42
	          },
	          end: {
	            line: 310,
	            column: 1
	          }
	        },
	        line: 298
	      },
	      '11': {
	        name: '(anonymous_11)',
	        decl: {
	          start: {
	            line: 324,
	            column: 20
	          },
	          end: {
	            line: 324,
	            column: 21
	          }
	        },
	        loc: {
	          start: {
	            line: 324,
	            column: 32
	          },
	          end: {
	            line: 330,
	            column: 1
	          }
	        },
	        line: 324
	      }
	    },
	    branchMap: {
	      '0': {
	        loc: {
	          start: {
	            line: 26,
	            column: 29
	          },
	          end: {
	            line: 26,
	            column: 52
	          }
	        },
	        type: 'binary-expr',
	        locations: [{
	          start: {
	            line: 26,
	            column: 29
	          },
	          end: {
	            line: 26,
	            column: 31
	          }
	        }, {
	          start: {
	            line: 26,
	            column: 35
	          },
	          end: {
	            line: 26,
	            column: 52
	          }
	        }],
	        line: 26
	      },
	      '1': {
	        loc: {
	          start: {
	            line: 37,
	            column: 34
	          },
	          end: {
	            line: 37,
	            column: 59
	          }
	        },
	        type: 'binary-expr',
	        locations: [{
	          start: {
	            line: 37,
	            column: 34
	          },
	          end: {
	            line: 37,
	            column: 42
	          }
	        }, {
	          start: {
	            line: 37,
	            column: 46
	          },
	          end: {
	            line: 37,
	            column: 59
	          }
	        }],
	        line: 37
	      },
	      '2': {
	        loc: {
	          start: {
	            line: 86,
	            column: 18
	          },
	          end: {
	            line: 86,
	            column: 80
	          }
	        },
	        type: 'binary-expr',
	        locations: [{
	          start: {
	            line: 86,
	            column: 18
	          },
	          end: {
	            line: 86,
	            column: 30
	          }
	        }, {
	          start: {
	            line: 86,
	            column: 34
	          },
	          end: {
	            line: 86,
	            column: 54
	          }
	        }, {
	          start: {
	            line: 86,
	            column: 58
	          },
	          end: {
	            line: 86,
	            column: 80
	          }
	        }],
	        line: 86
	      },
	      '3': {
	        loc: {
	          start: {
	            line: 96,
	            column: 6
	          },
	          end: {
	            line: 106,
	            column: 7
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 96,
	            column: 6
	          },
	          end: {
	            line: 106,
	            column: 7
	          }
	        }, {
	          start: {
	            line: 96,
	            column: 6
	          },
	          end: {
	            line: 106,
	            column: 7
	          }
	        }],
	        line: 96
	      },
	      '4': {
	        loc: {
	          start: {
	            line: 96,
	            column: 10
	          },
	          end: {
	            line: 96,
	            column: 83
	          }
	        },
	        type: 'binary-expr',
	        locations: [{
	          start: {
	            line: 96,
	            column: 10
	          },
	          end: {
	            line: 96,
	            column: 41
	          }
	        }, {
	          start: {
	            line: 96,
	            column: 45
	          },
	          end: {
	            line: 96,
	            column: 83
	          }
	        }],
	        line: 96
	      },
	      '5': {
	        loc: {
	          start: {
	            line: 134,
	            column: 2
	          },
	          end: {
	            line: 136,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 134,
	            column: 2
	          },
	          end: {
	            line: 136,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 134,
	            column: 2
	          },
	          end: {
	            line: 136,
	            column: 3
	          }
	        }],
	        line: 134
	      },
	      '6': {
	        loc: {
	          start: {
	            line: 161,
	            column: 2
	          },
	          end: {
	            line: 163,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 161,
	            column: 2
	          },
	          end: {
	            line: 163,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 161,
	            column: 2
	          },
	          end: {
	            line: 163,
	            column: 3
	          }
	        }],
	        line: 161
	      },
	      '7': {
	        loc: {
	          start: {
	            line: 161,
	            column: 6
	          },
	          end: {
	            line: 161,
	            column: 76
	          }
	        },
	        type: 'binary-expr',
	        locations: [{
	          start: {
	            line: 161,
	            column: 6
	          },
	          end: {
	            line: 161,
	            column: 37
	          }
	        }, {
	          start: {
	            line: 161,
	            column: 41
	          },
	          end: {
	            line: 161,
	            column: 76
	          }
	        }],
	        line: 161
	      },
	      '8': {
	        loc: {
	          start: {
	            line: 192,
	            column: 2
	          },
	          end: {
	            line: 194,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 192,
	            column: 2
	          },
	          end: {
	            line: 194,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 192,
	            column: 2
	          },
	          end: {
	            line: 194,
	            column: 3
	          }
	        }],
	        line: 192
	      },
	      '9': {
	        loc: {
	          start: {
	            line: 222,
	            column: 2
	          },
	          end: {
	            line: 224,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 222,
	            column: 2
	          },
	          end: {
	            line: 224,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 222,
	            column: 2
	          },
	          end: {
	            line: 224,
	            column: 3
	          }
	        }],
	        line: 222
	      },
	      '10': {
	        loc: {
	          start: {
	            line: 251,
	            column: 2
	          },
	          end: {
	            line: 263,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 251,
	            column: 2
	          },
	          end: {
	            line: 263,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 251,
	            column: 2
	          },
	          end: {
	            line: 263,
	            column: 3
	          }
	        }],
	        line: 251
	      },
	      '11': {
	        loc: {
	          start: {
	            line: 253,
	            column: 9
	          },
	          end: {
	            line: 263,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 253,
	            column: 9
	          },
	          end: {
	            line: 263,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 253,
	            column: 9
	          },
	          end: {
	            line: 263,
	            column: 3
	          }
	        }],
	        line: 253
	      },
	      '12': {
	        loc: {
	          start: {
	            line: 254,
	            column: 40
	          },
	          end: {
	            line: 254,
	            column: 74
	          }
	        },
	        type: 'binary-expr',
	        locations: [{
	          start: {
	            line: 254,
	            column: 40
	          },
	          end: {
	            line: 254,
	            column: 66
	          }
	        }, {
	          start: {
	            line: 254,
	            column: 70
	          },
	          end: {
	            line: 254,
	            column: 74
	          }
	        }],
	        line: 254
	      },
	      '13': {
	        loc: {
	          start: {
	            line: 255,
	            column: 9
	          },
	          end: {
	            line: 263,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 255,
	            column: 9
	          },
	          end: {
	            line: 263,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 255,
	            column: 9
	          },
	          end: {
	            line: 263,
	            column: 3
	          }
	        }],
	        line: 255
	      },
	      '14': {
	        loc: {
	          start: {
	            line: 257,
	            column: 9
	          },
	          end: {
	            line: 263,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 257,
	            column: 9
	          },
	          end: {
	            line: 263,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 257,
	            column: 9
	          },
	          end: {
	            line: 263,
	            column: 3
	          }
	        }],
	        line: 257
	      },
	      '15': {
	        loc: {
	          start: {
	            line: 258,
	            column: 34
	          },
	          end: {
	            line: 258,
	            column: 60
	          }
	        },
	        type: 'binary-expr',
	        locations: [{
	          start: {
	            line: 258,
	            column: 34
	          },
	          end: {
	            line: 258,
	            column: 52
	          }
	        }, {
	          start: {
	            line: 258,
	            column: 56
	          },
	          end: {
	            line: 258,
	            column: 60
	          }
	        }],
	        line: 258
	      },
	      '16': {
	        loc: {
	          start: {
	            line: 268,
	            column: 2
	          },
	          end: {
	            line: 274,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 268,
	            column: 2
	          },
	          end: {
	            line: 274,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 268,
	            column: 2
	          },
	          end: {
	            line: 274,
	            column: 3
	          }
	        }],
	        line: 268
	      },
	      '17': {
	        loc: {
	          start: {
	            line: 268,
	            column: 6
	          },
	          end: {
	            line: 268,
	            column: 57
	          }
	        },
	        type: 'binary-expr',
	        locations: [{
	          start: {
	            line: 268,
	            column: 6
	          },
	          end: {
	            line: 268,
	            column: 25
	          }
	        }, {
	          start: {
	            line: 268,
	            column: 29
	          },
	          end: {
	            line: 268,
	            column: 57
	          }
	        }],
	        line: 268
	      },
	      '18': {
	        loc: {
	          start: {
	            line: 269,
	            column: 28
	          },
	          end: {
	            line: 269,
	            column: 78
	          }
	        },
	        type: 'cond-expr',
	        locations: [{
	          start: {
	            line: 269,
	            column: 66
	          },
	          end: {
	            line: 269,
	            column: 70
	          }
	        }, {
	          start: {
	            line: 269,
	            column: 73
	          },
	          end: {
	            line: 269,
	            column: 78
	          }
	        }],
	        line: 269
	      },
	      '19': {
	        loc: {
	          start: {
	            line: 273,
	            column: 44
	          },
	          end: {
	            line: 273,
	            column: 76
	          }
	        },
	        type: 'binary-expr',
	        locations: [{
	          start: {
	            line: 273,
	            column: 44
	          },
	          end: {
	            line: 273,
	            column: 68
	          }
	        }, {
	          start: {
	            line: 273,
	            column: 72
	          },
	          end: {
	            line: 273,
	            column: 76
	          }
	        }],
	        line: 273
	      },
	      '20': {
	        loc: {
	          start: {
	            line: 299,
	            column: 2
	          },
	          end: {
	            line: 301,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 299,
	            column: 2
	          },
	          end: {
	            line: 301,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 299,
	            column: 2
	          },
	          end: {
	            line: 301,
	            column: 3
	          }
	        }],
	        line: 299
	      },
	      '21': {
	        loc: {
	          start: {
	            line: 305,
	            column: 2
	          },
	          end: {
	            line: 307,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 305,
	            column: 2
	          },
	          end: {
	            line: 307,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 305,
	            column: 2
	          },
	          end: {
	            line: 307,
	            column: 3
	          }
	        }],
	        line: 305
	      },
	      '22': {
	        loc: {
	          start: {
	            line: 325,
	            column: 16
	          },
	          end: {
	            line: 327,
	            column: 29
	          }
	        },
	        type: 'cond-expr',
	        locations: [{
	          start: {
	            line: 326,
	            column: 4
	          },
	          end: {
	            line: 326,
	            column: 29
	          }
	        }, {
	          start: {
	            line: 327,
	            column: 4
	          },
	          end: {
	            line: 327,
	            column: 29
	          }
	        }],
	        line: 325
	      }
	    },
	    s: {
	      '0': 0,
	      '1': 0,
	      '2': 0,
	      '3': 0,
	      '4': 0,
	      '5': 0,
	      '6': 0,
	      '7': 0,
	      '8': 0,
	      '9': 0,
	      '10': 0,
	      '11': 0,
	      '12': 0,
	      '13': 0,
	      '14': 0,
	      '15': 0,
	      '16': 0,
	      '17': 0,
	      '18': 0,
	      '19': 0,
	      '20': 0,
	      '21': 0,
	      '22': 0,
	      '23': 0,
	      '24': 0,
	      '25': 0,
	      '26': 0,
	      '27': 0,
	      '28': 0,
	      '29': 0,
	      '30': 0,
	      '31': 0,
	      '32': 0,
	      '33': 0,
	      '34': 0,
	      '35': 0,
	      '36': 0,
	      '37': 0,
	      '38': 0,
	      '39': 0,
	      '40': 0,
	      '41': 0,
	      '42': 0,
	      '43': 0,
	      '44': 0,
	      '45': 0,
	      '46': 0,
	      '47': 0,
	      '48': 0,
	      '49': 0,
	      '50': 0,
	      '51': 0,
	      '52': 0,
	      '53': 0,
	      '54': 0,
	      '55': 0,
	      '56': 0,
	      '57': 0,
	      '58': 0,
	      '59': 0,
	      '60': 0,
	      '61': 0,
	      '62': 0,
	      '63': 0,
	      '64': 0,
	      '65': 0,
	      '66': 0,
	      '67': 0,
	      '68': 0,
	      '69': 0,
	      '70': 0,
	      '71': 0,
	      '72': 0,
	      '73': 0,
	      '74': 0,
	      '75': 0,
	      '76': 0,
	      '77': 0,
	      '78': 0,
	      '79': 0,
	      '80': 0,
	      '81': 0,
	      '82': 0,
	      '83': 0,
	      '84': 0,
	      '85': 0,
	      '86': 0,
	      '87': 0,
	      '88': 0,
	      '89': 0,
	      '90': 0
	    },
	    f: {
	      '0': 0,
	      '1': 0,
	      '2': 0,
	      '3': 0,
	      '4': 0,
	      '5': 0,
	      '6': 0,
	      '7': 0,
	      '8': 0,
	      '9': 0,
	      '10': 0,
	      '11': 0
	    },
	    b: {
	      '0': [0, 0],
	      '1': [0, 0],
	      '2': [0, 0, 0],
	      '3': [0, 0],
	      '4': [0, 0],
	      '5': [0, 0],
	      '6': [0, 0],
	      '7': [0, 0],
	      '8': [0, 0],
	      '9': [0, 0],
	      '10': [0, 0],
	      '11': [0, 0],
	      '12': [0, 0],
	      '13': [0, 0],
	      '14': [0, 0],
	      '15': [0, 0],
	      '16': [0, 0],
	      '17': [0, 0],
	      '18': [0, 0],
	      '19': [0, 0],
	      '20': [0, 0],
	      '21': [0, 0],
	      '22': [0, 0]
	    },
	    _coverageSchema: '332fd63041d2c1bcb487cc26dd0d5f7d97098a6c'
	  },
	      coverage = global[gcv] || (global[gcv] = {});

	  if (coverage[path] && coverage[path].hash === hash) {
	    return coverage[path];
	  }

	  coverageData.hash = hash;
	  return coverage[path] = coverageData;
	}();
	cov_20bjz8jx2s.s[0]++;

	var isEl = function isEl(el) {
	  cov_20bjz8jx2s.f[0]++;
	  cov_20bjz8jx2s.s[1]++;
	  return Boolean((cov_20bjz8jx2s.b[0][0]++, el) && (cov_20bjz8jx2s.b[0][1]++, el.nodeType === 1));
	};

	cov_20bjz8jx2s.s[2]++;

	var isElInDom = function isElInDom(el) {
	  cov_20bjz8jx2s.f[1]++;
	  cov_20bjz8jx2s.s[3]++;
	  return Boolean((cov_20bjz8jx2s.b[1][0]++, isEl(el)) && (cov_20bjz8jx2s.b[1][1]++, el.parentNode));
	};

	cov_20bjz8jx2s.s[4]++;

	var createIframeEmbed = function createIframeEmbed(params) {
	  cov_20bjz8jx2s.f[2]++;
	  var el = (cov_20bjz8jx2s.s[5]++, document_1.createElement('iframe'));
	  cov_20bjz8jx2s.s[6]++;
	  el.setAttribute('allow', 'autoplay;encrypted-media;fullscreen');
	  cov_20bjz8jx2s.s[7]++;
	  el.setAttribute('allowfullscreen', 'allowfullscreen');
	  cov_20bjz8jx2s.s[8]++;
	  el.src = urls.getUrl(params);
	  cov_20bjz8jx2s.s[9]++;
	  return el;
	};

	cov_20bjz8jx2s.s[10]++;

	var createInPageEmbed = function createInPageEmbed(params) {
	  cov_20bjz8jx2s.f[3]++;

	  var _ref = (cov_20bjz8jx2s.s[11]++, params),
	      embedOptions = _ref.embedOptions;

	  var paramsToAttrs = (cov_20bjz8jx2s.s[12]++, {
	    adConfigId: 'data-ad-config-id',
	    applicationId: 'data-application-id',
	    catalogSearch: 'data-catalog-search',
	    catalogSequence: 'data-catalog-sequence',
	    deliveryConfigId: 'data-delivery-config-id',
	    playlistId: 'data-playlist-id',
	    playlistVideoId: 'data-playlist-video-id',
	    poster: 'poster',
	    videoId: 'data-video-id'
	  });
	  var tagName = (cov_20bjz8jx2s.s[13]++, (cov_20bjz8jx2s.b[2][0]++, embedOptions) && (cov_20bjz8jx2s.b[2][1]++, embedOptions.tagName) || (cov_20bjz8jx2s.b[2][2]++, EMBED_TAG_NAME_VIDEOJS));
	  var el = (cov_20bjz8jx2s.s[14]++, document_1.createElement(tagName));
	  cov_20bjz8jx2s.s[15]++;
	  Object.keys(paramsToAttrs).filter(function (key) {
	    cov_20bjz8jx2s.f[4]++;
	    cov_20bjz8jx2s.s[16]++;
	    return params[key];
	  }).forEach(function (key) {
	    cov_20bjz8jx2s.f[5]++;
	    var value;
	    cov_20bjz8jx2s.s[17]++;

	    if ((cov_20bjz8jx2s.b[4][0]++, typeof params[key] !== 'string') && (cov_20bjz8jx2s.b[4][1]++, JSON_ALLOWED_ATTRS.indexOf(key) !== -1)) {
	      cov_20bjz8jx2s.b[3][0]++;
	      cov_20bjz8jx2s.s[18]++;

	      try {
	        cov_20bjz8jx2s.s[19]++;
	        value = JSON.stringify(params[key]);
	      } catch (x) {
	        cov_20bjz8jx2s.s[20]++;
	        return;
	      }
	    } else {
	      cov_20bjz8jx2s.b[3][1]++;
	      cov_20bjz8jx2s.s[21]++;
	      value = String(params[key]).trim();
	    }

	    cov_20bjz8jx2s.s[22]++;
	    el.setAttribute(paramsToAttrs[key], value);
	  });
	  cov_20bjz8jx2s.s[23]++;
	  el.setAttribute('controls', 'controls');
	  cov_20bjz8jx2s.s[24]++;
	  el.classList.add('video-js');
	  cov_20bjz8jx2s.s[25]++;
	  return el;
	};

	cov_20bjz8jx2s.s[26]++;

	var wrapResponsive = function wrapResponsive(embedType, embedOptions, el) {
	  cov_20bjz8jx2s.f[6]++;
	  cov_20bjz8jx2s.s[27]++;

	  if (!embedOptions.responsive) {
	    cov_20bjz8jx2s.b[5][0]++;
	    cov_20bjz8jx2s.s[28]++;
	    return el;
	  } else {
	    cov_20bjz8jx2s.b[5][1]++;
	  }

	  cov_20bjz8jx2s.s[29]++;
	  el.style.position = 'absolute';
	  cov_20bjz8jx2s.s[30]++;
	  el.style.top = '0px';
	  cov_20bjz8jx2s.s[31]++;
	  el.style.right = '0px';
	  cov_20bjz8jx2s.s[32]++;
	  el.style.bottom = '0px';
	  cov_20bjz8jx2s.s[33]++;
	  el.style.left = '0px';
	  cov_20bjz8jx2s.s[34]++;
	  el.style.width = '100%';
	  cov_20bjz8jx2s.s[35]++;
	  el.style.height = '100%';
	  var responsive = (cov_20bjz8jx2s.s[36]++, _extends({
	    aspectRatio: DEFAULT_ASPECT_RATIO,
	    iframeHorizontalPlaylist: DEFAULT_IFRAME_HORIZONTAL_PLAYLIST,
	    maxWidth: DEFAULT_MAX_WIDTH
	  }, embedOptions.responsive));
	  var aspectRatio = (cov_20bjz8jx2s.s[37]++, responsive.aspectRatio.split(':').map(Number));
	  var inner = (cov_20bjz8jx2s.s[38]++, document_1.createElement('div'));
	  var paddingTop = (cov_20bjz8jx2s.s[39]++, aspectRatio[1] / aspectRatio[0] * 100);
	  cov_20bjz8jx2s.s[40]++;

	  if ((cov_20bjz8jx2s.b[7][0]++, embedType === EMBED_TYPE_IFRAME) && (cov_20bjz8jx2s.b[7][1]++, responsive.iframeHorizontalPlaylist)) {
	    cov_20bjz8jx2s.b[6][0]++;
	    cov_20bjz8jx2s.s[41]++;
	    paddingTop *= 1.25;
	  } else {
	    cov_20bjz8jx2s.b[6][1]++;
	  }

	  cov_20bjz8jx2s.s[42]++;
	  inner.style.paddingTop = paddingTop + '%';
	  cov_20bjz8jx2s.s[43]++;
	  inner.appendChild(el);
	  var outer = (cov_20bjz8jx2s.s[44]++, document_1.createElement('div'));
	  cov_20bjz8jx2s.s[45]++;
	  outer.style.position = 'relative';
	  cov_20bjz8jx2s.s[46]++;
	  outer.style.display = 'block';
	  cov_20bjz8jx2s.s[47]++;
	  outer.style.maxWidth = responsive.maxWidth;
	  cov_20bjz8jx2s.s[48]++;
	  outer.appendChild(inner);
	  cov_20bjz8jx2s.s[49]++;
	  return outer;
	};

	cov_20bjz8jx2s.s[50]++;

	var wrapPip = function wrapPip(embedOptions, el) {
	  cov_20bjz8jx2s.f[7]++;
	  cov_20bjz8jx2s.s[51]++;

	  if (!embedOptions.pip) {
	    cov_20bjz8jx2s.b[8][0]++;
	    cov_20bjz8jx2s.s[52]++;
	    return el;
	  } else {
	    cov_20bjz8jx2s.b[8][1]++;
	  }

	  var pip = (cov_20bjz8jx2s.s[53]++, document_1.createElement('div'));
	  cov_20bjz8jx2s.s[54]++;
	  pip.classList.add('vjs-pip-container');
	  cov_20bjz8jx2s.s[55]++;
	  pip.appendChild(el);
	  cov_20bjz8jx2s.s[56]++;
	  return pip;
	};

	cov_20bjz8jx2s.s[57]++;

	var wrapEmbed = function wrapEmbed(embedType, embedOptions, embed) {
	  cov_20bjz8jx2s.f[8]++;
	  cov_20bjz8jx2s.s[58]++;

	  if (!embedOptions) {
	    cov_20bjz8jx2s.b[9][0]++;
	    cov_20bjz8jx2s.s[59]++;
	    return embed;
	  } else {
	    cov_20bjz8jx2s.b[9][1]++;
	  }

	  cov_20bjz8jx2s.s[60]++;
	  return wrapPip(embedOptions, wrapResponsive(embedType, embedOptions, embed));
	};

	cov_20bjz8jx2s.s[61]++;

	var insertEmbed = function insertEmbed(params, embed) {
	  cov_20bjz8jx2s.f[9]++;

	  var _ref2 = (cov_20bjz8jx2s.s[62]++, params),
	      refNode = _ref2.refNode,
	      refNodeInsert = _ref2.refNodeInsert;

	  var refNodeParent = (cov_20bjz8jx2s.s[63]++, refNode.parentNode);
	  var wrapped = (cov_20bjz8jx2s.s[64]++, wrapEmbed(params.embedType, params.embedOptions, embed));
	  cov_20bjz8jx2s.s[65]++;

	  if (refNodeInsert === REF_NODE_INSERT_BEFORE) {
	    cov_20bjz8jx2s.b[10][0]++;
	    cov_20bjz8jx2s.s[66]++;
	    refNodeParent.insertBefore(wrapped, refNode);
	  } else {
	    cov_20bjz8jx2s.b[10][1]++;
	    cov_20bjz8jx2s.s[67]++;

	    if (refNodeInsert === REF_NODE_INSERT_AFTER) {
	      cov_20bjz8jx2s.b[11][0]++;
	      cov_20bjz8jx2s.s[68]++;
	      refNodeParent.insertBefore(wrapped, (cov_20bjz8jx2s.b[12][0]++, refNode.nextElementSibling) || (cov_20bjz8jx2s.b[12][1]++, null));
	    } else {
	      cov_20bjz8jx2s.b[11][1]++;
	      cov_20bjz8jx2s.s[69]++;

	      if (refNodeInsert === REF_NODE_INSERT_REPLACE) {
	        cov_20bjz8jx2s.b[13][0]++;
	        cov_20bjz8jx2s.s[70]++;
	        refNodeParent.replaceChild(wrapped, refNode);
	      } else {
	        cov_20bjz8jx2s.b[13][1]++;
	        cov_20bjz8jx2s.s[71]++;

	        if (refNodeInsert === REF_NODE_INSERT_PREPEND) {
	          cov_20bjz8jx2s.b[14][0]++;
	          cov_20bjz8jx2s.s[72]++;
	          refNode.insertBefore(wrapped, (cov_20bjz8jx2s.b[15][0]++, refNode.firstChild) || (cov_20bjz8jx2s.b[15][1]++, null));
	        } else {
	          cov_20bjz8jx2s.b[14][1]++;
	          cov_20bjz8jx2s.s[73]++;
	          refNode.appendChild(wrapped);
	        }
	      }
	    }
	  }

	  cov_20bjz8jx2s.s[74]++;

	  if ((cov_20bjz8jx2s.b[17][0]++, params.embedOptions) && (cov_20bjz8jx2s.b[17][1]++, params.embedOptions.playlist)) {
	    cov_20bjz8jx2s.b[16][0]++;
	    var playlistTagName = (cov_20bjz8jx2s.s[75]++, params.embedOptions.playlist.legacy ? (cov_20bjz8jx2s.b[18][0]++, 'ul') : (cov_20bjz8jx2s.b[18][1]++, 'div'));
	    var playlist = (cov_20bjz8jx2s.s[76]++, document_1.createElement(playlistTagName));
	    cov_20bjz8jx2s.s[77]++;
	    playlist.classList.add('vjs-playlist');
	    cov_20bjz8jx2s.s[78]++;
	    embed.parentNode.insertBefore(playlist, (cov_20bjz8jx2s.b[19][0]++, embed.nextElementSibling) || (cov_20bjz8jx2s.b[19][1]++, null));
	  } else {
	    cov_20bjz8jx2s.b[16][1]++;
	  }

	  cov_20bjz8jx2s.s[79]++;
	  params.refNode = null;
	  cov_20bjz8jx2s.s[80]++;
	  return embed;
	};

	cov_20bjz8jx2s.s[81]++;

	var onEmbedCreated = function onEmbedCreated(params, embed) {
	  cov_20bjz8jx2s.f[10]++;
	  cov_20bjz8jx2s.s[82]++;

	  if (typeof params.onEmbedCreated !== 'function') {
	    cov_20bjz8jx2s.b[20][0]++;
	    cov_20bjz8jx2s.s[83]++;
	    return embed;
	  } else {
	    cov_20bjz8jx2s.b[20][1]++;
	  }

	  var result = (cov_20bjz8jx2s.s[84]++, params.onEmbedCreated(embed));
	  cov_20bjz8jx2s.s[85]++;

	  if (isEl(result)) {
	    cov_20bjz8jx2s.b[21][0]++;
	    cov_20bjz8jx2s.s[86]++;
	    return result;
	  } else {
	    cov_20bjz8jx2s.b[21][1]++;
	  }

	  cov_20bjz8jx2s.s[87]++;
	  return embed;
	};

	cov_20bjz8jx2s.s[88]++;

	var createEmbed = function createEmbed(params) {
	  cov_20bjz8jx2s.f[11]++;
	  var embed = (cov_20bjz8jx2s.s[89]++, params.embedType === EMBED_TYPE_IFRAME ? (cov_20bjz8jx2s.b[22][0]++, createIframeEmbed(params)) : (cov_20bjz8jx2s.b[22][1]++, createInPageEmbed(params)));
	  cov_20bjz8jx2s.s[90]++;
	  return insertEmbed(params, onEmbedCreated(params, embed));
	};

	QUnit.module('create-embed', function (hooks) {
	  hooks.beforeEach(function () {
	    this.fixture = document_1.getElementById('qunit-fixture');
	  });
	  hooks.afterEach(function () {
	    this.fixture = null;
	  });
	  QUnit.module('in-page');
	  QUnit.test('creates an in-page embed by default', function (assert) {
	    var embed = createEmbed({
	      refNode: this.fixture,
	      refNodeInsert: 'append'
	    });
	    assert.strictEqual(embed.nodeName, 'VIDEO-JS', 'created an in-page embed');
	    assert.strictEqual(embed.parentNode, this.fixture, 'appended it to the fixture');
	    assert.ok(embed.hasAttribute('controls'), 'has controls attribute');
	    assert.ok(embed.classList.contains('video-js'), 'has video-js class');
	    assert.notOk(embed.hasAttribute('data-account'), 'we never include data-account because we want to init players ourselves');
	    assert.notOk(embed.hasAttribute('data-player'), 'we never include data-player because we want to init players ourselves');
	    assert.notOk(embed.hasAttribute('data-embed'), 'we never include data-embed because we want to init players ourselves');
	  });
	  QUnit.test('populates certain attributes from params', function (assert) {
	    var embed = createEmbed({
	      refNode: this.fixture,
	      refNodeInsert: 'append',
	      adConfigId: 'ad-conf-id',
	      applicationId: 'app-id',
	      catalogSearch: 'cat-search',
	      catalogSequence: 'cat-seq',
	      deliveryConfigId: 'conf-id',
	      playlistId: 'pl-id',
	      playlistVideoId: 'pl-v-id',
	      poster: 'pstr',
	      videoId: 'v-id'
	    });
	    assert.strictEqual(embed.getAttribute('data-ad-config-id'), 'ad-conf-id', 'has correct data-ad-config-id attribute');
	    assert.strictEqual(embed.getAttribute('data-application-id'), 'app-id', 'has correct data-application-id attribute');
	    assert.strictEqual(embed.getAttribute('data-catalog-search'), 'cat-search', 'has correct data-catalog-search attribute');
	    assert.strictEqual(embed.getAttribute('data-catalog-sequence'), 'cat-seq', 'has correct data-catalog-sequence attribute');
	    assert.strictEqual(embed.getAttribute('data-delivery-config-id'), 'conf-id', 'has correct data-delivery-config-id attribute');
	    assert.strictEqual(embed.getAttribute('data-playlist-id'), 'pl-id', 'has correct data-playlist-id attribute');
	    assert.strictEqual(embed.getAttribute('data-playlist-video-id'), 'pl-v-id', 'has correct data-playlist-video-id attribute');
	    assert.strictEqual(embed.getAttribute('poster'), 'pstr', 'has correct data-playlist-video-id attribute');
	    assert.strictEqual(embed.getAttribute('data-video-id'), 'v-id', 'has correct data-video-id attribute');
	  });
	  QUnit.test('JSON-encodes certain attributes', function (assert) {
	    var embed = createEmbed({
	      refNode: this.fixture,
	      refNodeInsert: 'append',
	      catalogSearch: {
	        q: 'cat-search'
	      },
	      catalogSequence: [{
	        q: 'cat-seq-1'
	      }, {
	        q: 'cat-seq-2'
	      }]
	    });
	    assert.strictEqual(embed.getAttribute('data-catalog-search'), '{"q":"cat-search"}', 'has correct data-catalog-search attribute');
	    assert.strictEqual(embed.getAttribute('data-catalog-sequence'), '[{"q":"cat-seq-1"},{"q":"cat-seq-2"}]', 'has correct data-catalog-sequence attribute');
	  });
	  QUnit.module('iframe');
	  QUnit.test('create an iframe embed', function (assert) {
	    var embed = createEmbed({
	      embedType: 'iframe',
	      refNode: this.fixture,
	      refNodeInsert: 'append'
	    });
	    assert.strictEqual(embed.nodeName, 'IFRAME', 'created an iframe embed');
	    assert.strictEqual(embed.parentNode, this.fixture, 'appended it to the fixture');
	    assert.strictEqual(embed.getAttribute('allow'), 'autoplay;encrypted-media;fullscreen', 'has correct allow attribute');
	    assert.ok(embed.hasAttribute('allowfullscreen'), 'has allowfullscreen attribute');
	  });
	  QUnit.test('populates certain query string parameters from params', function (assert) {
	    var embed = createEmbed({
	      embedType: 'iframe',
	      refNode: this.fixture,
	      refNodeInsert: 'append',
	      applicationId: 'app-id',
	      catalogSearch: 'cat-search',
	      catalogSequence: 'cat-seq',
	      playlistId: 'pl-id',
	      playlistVideoId: 'pl-v-id',
	      videoId: 'v-id'
	    });
	    var src = embed.getAttribute('src');
	    assert.ok(src.indexOf('applicationId=app-id') > -1, 'has correct applicationId param');
	    assert.ok(src.indexOf('catalogSearch=cat-search') > -1, 'has correct catalogSearch param');
	    assert.ok(src.indexOf('catalogSequence=cat-seq') > -1, 'has correct catalogSequence param');
	    assert.ok(src.indexOf('playlistId=pl-id') > -1, 'has correct playlistId param');
	    assert.ok(src.indexOf('playlistVideoId=pl-v-id') > -1, 'has correct playlistVideoId param');
	    assert.ok(src.indexOf('videoId=v-id') > -1, 'has correct videoId param');
	  });
	  QUnit.test('JSON-encodes certain query string parameters', function (assert) {
	    var embed = createEmbed({
	      embedType: 'iframe',
	      refNode: this.fixture,
	      refNodeInsert: 'append',
	      catalogSearch: {
	        q: 'cat-search'
	      },
	      catalogSequence: [{
	        q: 'cat-seq-1'
	      }, {
	        q: 'cat-seq-2'
	      }]
	    });
	    var src = embed.getAttribute('src');
	    assert.ok(src.indexOf('catalogSearch=%7B%22q%22%3A%22cat-search%22%7D') > -1, 'has correct catalogSearch param');
	    assert.ok(src.indexOf('catalogSequence=%5B%7B%22q%22%3A%22cat-seq-1%22%7D%2C%7B%22q%22%3A%22cat-seq-2%22%7D%5D') > -1, 'has correct catalogSequence param');
	  });
	  QUnit.module('embed insertion', {
	    beforeEach: function beforeEach() {
	      this.p = document_1.createElement('p'); // Add a paragraph element so we can verify that the various insertion
	      // methods work properly.

	      this.fixture.appendChild(this.p);
	    },
	    afterEach: function afterEach() {
	      this.p = null;
	    }
	  });
	  QUnit.test('"append" makes the embed the last child of the refNode', function (assert) {
	    var embed = createEmbed({
	      refNode: this.fixture,
	      refNodeInsert: 'append'
	    });
	    assert.strictEqual(embed.parentNode, this.fixture, 'has the correct parentNode');
	    assert.strictEqual(embed, this.fixture.lastChild, 'was appended');
	  });
	  QUnit.test('"prepend" makes the embed the first child of the refNode', function (assert) {
	    var embed = createEmbed({
	      refNode: this.fixture,
	      refNodeInsert: 'prepend'
	    });
	    assert.strictEqual(embed.parentNode, this.fixture, 'has the correct parentNode');
	    assert.strictEqual(embed, this.fixture.firstChild, 'was prepended');
	  });
	  QUnit.test('"before" makes the embed the previous sibling of the refNode', function (assert) {
	    var embed = createEmbed({
	      refNode: this.p,
	      refNodeInsert: 'before'
	    });
	    assert.strictEqual(embed.parentNode, this.fixture, 'has the correct parentNode');
	    assert.strictEqual(embed.nextSibling, this.p, 'was added before p');
	  });
	  QUnit.test('"after" makes the embed the next sibling of the refNode', function (assert) {
	    var embed = createEmbed({
	      refNode: this.p,
	      refNodeInsert: 'after'
	    });
	    assert.strictEqual(embed.parentNode, this.fixture, 'has the correct parentNode');
	    assert.strictEqual(embed.previousSibling, this.p, 'was added after p');
	  });
	  QUnit.test('"replace" makes the embed replace the refNode', function (assert) {
	    var embed = createEmbed({
	      refNode: this.p,
	      refNodeInsert: 'replace'
	    });
	    assert.strictEqual(embed.parentNode, this.fixture, 'has the correct parentNode');
	    assert.strictEqual(this.p.parentNode, null, 'p was removed');
	  });
	  QUnit.module('embed options', {
	    before: function before() {
	      this.isPipContainer = function (assert, el) {
	        assert.ok(el.nodeName, 'DIV', 'is a div');
	        assert.ok(el.classList.contains('vjs-pip-container'), 'is a pip container');
	      };

	      this.nextSiblingIsPlaylistContainer = function (assert, embed) {
	        assert.strictEqual(embed.nextSibling.nodeName, 'DIV', 'is a div');
	        assert.ok(embed.nextSibling.classList.contains('vjs-playlist'), 'is a playlist container');
	      };

	      this.hasResponsiveStyles = function (assert, embed) {
	        assert.strictEqual(embed.style.position, 'absolute', 'embed has the expected style.position');
	        assert.strictEqual(embed.style.top, '0px', 'embed has the expected style.top');
	        assert.strictEqual(embed.style.right, '0px', 'embed has the expected style.right');
	        assert.strictEqual(embed.style.bottom, '0px', 'embed has the expected style.bottom');
	        assert.strictEqual(embed.style.left, '0px', 'embed has the expected style.left');
	        assert.strictEqual(embed.style.width, '100%', 'embed has the expected style.width');
	        assert.strictEqual(embed.style.height, '100%', 'embed has the expected style.height');
	      };

	      this.isResponsiveContainer = function (assert, el, paddingTop, maxWidth) {
	        if (paddingTop === void 0) {
	          paddingTop = '56.25%';
	        }

	        if (maxWidth === void 0) {
	          maxWidth = '100%';
	        }

	        assert.strictEqual(el.nodeName, 'DIV', 'is a div');
	        assert.strictEqual(el.style.paddingTop, paddingTop, 'has the expected style.paddingTop');
	        assert.strictEqual(el.parentNode.nodeName, 'DIV', 'parent is a div');
	        assert.strictEqual(el.parentNode.style.position, 'relative', 'parent has the expected style.position');
	        assert.strictEqual(el.parentNode.style.display, 'block', 'parent has the expected style.display');
	        assert.strictEqual(el.parentNode.style.maxWidth, maxWidth, 'parent has the expected style.maxWidth');
	      };
	    }
	  });
	  QUnit.test('pip', function (assert) {
	    var embed = createEmbed({
	      refNode: this.fixture,
	      refNodeInsert: 'append',
	      embedOptions: {
	        pip: true
	      }
	    });
	    assert.strictEqual(embed.parentNode.parentNode, this.fixture, 'has the expected relationship to the fixture');
	    this.isPipContainer(assert, embed.parentNode);
	  });
	  QUnit.test('playlists', function (assert) {
	    var embed = createEmbed({
	      refNode: this.fixture,
	      refNodeInsert: 'append',
	      embedOptions: {
	        playlist: true
	      }
	    });
	    assert.strictEqual(embed.parentNode, this.fixture, 'has the expected relationship to the fixture');
	    this.nextSiblingIsPlaylistContainer(assert, embed);
	  });
	  QUnit.test('responsive', function (assert) {
	    var embed = createEmbed({
	      refNode: this.fixture,
	      refNodeInsert: 'append',
	      embedOptions: {
	        responsive: true
	      }
	    });
	    assert.strictEqual(embed.parentNode.parentNode.parentNode, this.fixture, 'has the expected relationship to the fixture');
	    this.hasResponsiveStyles(assert, embed);
	    this.isResponsiveContainer(assert, embed.parentNode);
	  });
	  QUnit.test('responsive custom values', function (assert) {
	    var embed = createEmbed({
	      refNode: this.fixture,
	      refNodeInsert: 'append',
	      embedOptions: {
	        responsive: {
	          aspectRatio: '4:3',
	          maxWidth: '960px'
	        }
	      }
	    });
	    assert.strictEqual(embed.parentNode.parentNode.parentNode, this.fixture, 'has the expected relationship to the fixture');
	    this.hasResponsiveStyles(assert, embed);
	    this.isResponsiveContainer(assert, embed.parentNode, '75%', '960px');
	  });
	  QUnit.test('pip + playlists', function (assert) {
	    var embed = createEmbed({
	      refNode: this.fixture,
	      refNodeInsert: 'append',
	      embedOptions: {
	        pip: true,
	        playlist: true
	      }
	    });
	    assert.strictEqual(embed.parentNode.parentNode, this.fixture, 'has the expected relationship to the fixture');
	    this.nextSiblingIsPlaylistContainer(assert, embed);
	    this.isPipContainer(assert, embed.parentNode);
	  });
	  QUnit.test('pip + responsive', function (assert) {
	    var embed = createEmbed({
	      refNode: this.fixture,
	      refNodeInsert: 'append',
	      embedOptions: {
	        pip: true,
	        responsive: true
	      }
	    });
	    assert.strictEqual(embed.parentNode.parentNode.parentNode.parentNode, this.fixture, 'has the expected relationship to the fixture');
	    this.hasResponsiveStyles(assert, embed);
	    this.isResponsiveContainer(assert, embed.parentNode);
	    this.isPipContainer(assert, embed.parentNode.parentNode.parentNode);
	  });
	  QUnit.test('playlists + responsive', function (assert) {
	    var embed = createEmbed({
	      refNode: this.fixture,
	      refNodeInsert: 'append',
	      embedOptions: {
	        playlist: true,
	        responsive: true
	      }
	    });
	    assert.strictEqual(embed.parentNode.parentNode.parentNode, this.fixture, 'has the expected relationship to the fixture');
	    this.nextSiblingIsPlaylistContainer(assert, embed);
	    this.hasResponsiveStyles(assert, embed);
	    this.isResponsiveContainer(assert, embed.parentNode);
	  });
	  QUnit.test('pip + playlists + responsive', function (assert) {
	    var embed = createEmbed({
	      refNode: this.fixture,
	      refNodeInsert: 'append',
	      embedOptions: {
	        pip: true,
	        playlist: true,
	        responsive: true
	      }
	    });
	    assert.strictEqual(embed.parentNode.parentNode.parentNode.parentNode, this.fixture, 'has the expected relationship to the fixture');
	    this.nextSiblingIsPlaylistContainer(assert, embed);
	    this.hasResponsiveStyles(assert, embed);
	    this.isResponsiveContainer(assert, embed.parentNode);
	    this.isPipContainer(assert, embed.parentNode.parentNode.parentNode);
	  });
	  QUnit.test('tagName', function (assert) {
	    var embedOne = createEmbed({
	      refNode: this.fixture,
	      refNodeInsert: 'append'
	    });
	    assert.strictEqual(embedOne.tagName, 'VIDEO-JS', 'is a video-js element');
	    var embedTwo = createEmbed({
	      refNode: this.fixture,
	      refNodeInsert: 'append',
	      embedOptions: {
	        tagName: 'video-js'
	      }
	    });
	    assert.strictEqual(embedTwo.tagName, 'VIDEO-JS', 'is a video-js element');
	    var embedThree = createEmbed({
	      refNode: this.fixture,
	      refNodeInsert: 'append',
	      embedOptions: {
	        tagName: 'video'
	      }
	    });
	    assert.strictEqual(embedThree.tagName, 'VIDEO', 'is a video element');
	    var embedFour = createEmbed({
	      refNode: this.fixture,
	      refNodeInsert: 'append',
	      embedOptions: {
	        tagName: 'div'
	      }
	    });
	    assert.strictEqual(embedFour.tagName, 'DIV', 'WILL create invalid embeds as it is not a public function');
	  });
	  QUnit.module('onEmbedCreated');
	  QUnit.test('a callback can be provided to customize the embed', function (assert) {
	    var embed = createEmbed({
	      onEmbedCreated: function onEmbedCreated(el) {
	        el.id = 'derp';
	      },
	      refNode: this.fixture,
	      refNodeInsert: 'append'
	    });
	    assert.strictEqual(embed.nodeName, 'VIDEO-JS', 'the embed is the correct element');
	    assert.strictEqual(embed.id, 'derp', 'the embed has the correct ID');
	  });
	});

	var version$1 = "1.8.0";

	var cov_1ngy6na5sz = function () {
	  var path = '/Users/poneill/dev/player-loader/src/player-script-cache.js',
	      hash = '91457ef31a951eade19524a3588e839b1732d479',
	      Function = function () {}.constructor,
	      global = new Function('return this')(),
	      gcv = '__coverage__',
	      coverageData = {
	    path: '/Users/poneill/dev/player-loader/src/player-script-cache.js',
	    statementMap: {
	      '0': {
	        start: {
	          line: 9,
	          column: 20
	        },
	        end: {
	          line: 9,
	          column: 36
	        }
	      },
	      '1': {
	        start: {
	          line: 32,
	          column: 12
	        },
	        end: {
	          line: 32,
	          column: 92
	        }
	      },
	      '2': {
	        start: {
	          line: 32,
	          column: 48
	        },
	        end: {
	          line: 32,
	          column: 92
	        }
	      },
	      '3': {
	        start: {
	          line: 53,
	          column: 14
	        },
	        end: {
	          line: 55,
	          column: 1
	        }
	      },
	      '4': {
	        start: {
	          line: 54,
	          column: 2
	        },
	        end: {
	          line: 54,
	          column: 73
	        }
	      },
	      '5': {
	        start: {
	          line: 78,
	          column: 12
	        },
	        end: {
	          line: 78,
	          column: 50
	        }
	      },
	      '6': {
	        start: {
	          line: 78,
	          column: 23
	        },
	        end: {
	          line: 78,
	          column: 50
	        }
	      },
	      '7': {
	        start: {
	          line: 102,
	          column: 12
	        },
	        end: {
	          line: 102,
	          column: 50
	        }
	      },
	      '8': {
	        start: {
	          line: 102,
	          column: 23
	        },
	        end: {
	          line: 102,
	          column: 50
	        }
	      },
	      '9': {
	        start: {
	          line: 107,
	          column: 14
	        },
	        end: {
	          line: 109,
	          column: 1
	        }
	      },
	      '10': {
	        start: {
	          line: 108,
	          column: 2
	        },
	        end: {
	          line: 108,
	          column: 22
	        }
	      },
	      '11': {
	        start: {
	          line: 118,
	          column: 16
	        },
	        end: {
	          line: 120,
	          column: 1
	        }
	      },
	      '12': {
	        start: {
	          line: 119,
	          column: 2
	        },
	        end: {
	          line: 119,
	          column: 26
	        }
	      }
	    },
	    fnMap: {
	      '0': {
	        name: '(anonymous_0)',
	        decl: {
	          start: {
	            line: 32,
	            column: 12
	          },
	          end: {
	            line: 32,
	            column: 13
	          }
	        },
	        loc: {
	          start: {
	            line: 32,
	            column: 48
	          },
	          end: {
	            line: 32,
	            column: 92
	          }
	        },
	        line: 32
	      },
	      '1': {
	        name: '(anonymous_1)',
	        decl: {
	          start: {
	            line: 53,
	            column: 14
	          },
	          end: {
	            line: 53,
	            column: 15
	          }
	        },
	        loc: {
	          start: {
	            line: 53,
	            column: 25
	          },
	          end: {
	            line: 55,
	            column: 1
	          }
	        },
	        line: 53
	      },
	      '2': {
	        name: '(anonymous_2)',
	        decl: {
	          start: {
	            line: 78,
	            column: 12
	          },
	          end: {
	            line: 78,
	            column: 13
	          }
	        },
	        loc: {
	          start: {
	            line: 78,
	            column: 23
	          },
	          end: {
	            line: 78,
	            column: 50
	          }
	        },
	        line: 78
	      },
	      '3': {
	        name: '(anonymous_3)',
	        decl: {
	          start: {
	            line: 102,
	            column: 12
	          },
	          end: {
	            line: 102,
	            column: 13
	          }
	        },
	        loc: {
	          start: {
	            line: 102,
	            column: 23
	          },
	          end: {
	            line: 102,
	            column: 50
	          }
	        },
	        line: 102
	      },
	      '4': {
	        name: '(anonymous_4)',
	        decl: {
	          start: {
	            line: 107,
	            column: 14
	          },
	          end: {
	            line: 107,
	            column: 15
	          }
	        },
	        loc: {
	          start: {
	            line: 107,
	            column: 20
	          },
	          end: {
	            line: 109,
	            column: 1
	          }
	        },
	        line: 107
	      },
	      '5': {
	        name: '(anonymous_5)',
	        decl: {
	          start: {
	            line: 118,
	            column: 16
	          },
	          end: {
	            line: 118,
	            column: 17
	          }
	        },
	        loc: {
	          start: {
	            line: 118,
	            column: 24
	          },
	          end: {
	            line: 120,
	            column: 1
	          }
	        },
	        line: 118
	      }
	    },
	    branchMap: {
	      '0': {
	        loc: {
	          start: {
	            line: 32,
	            column: 51
	          },
	          end: {
	            line: 32,
	            column: 67
	          }
	        },
	        type: 'binary-expr',
	        locations: [{
	          start: {
	            line: 32,
	            column: 51
	          },
	          end: {
	            line: 32,
	            column: 60
	          }
	        }, {
	          start: {
	            line: 32,
	            column: 64
	          },
	          end: {
	            line: 32,
	            column: 67
	          }
	        }],
	        line: 32
	      },
	      '1': {
	        loc: {
	          start: {
	            line: 54,
	            column: 30
	          },
	          end: {
	            line: 54,
	            column: 71
	          }
	        },
	        type: 'cond-expr',
	        locations: [{
	          start: {
	            line: 54,
	            column: 48
	          },
	          end: {
	            line: 54,
	            column: 66
	          }
	        }, {
	          start: {
	            line: 54,
	            column: 69
	          },
	          end: {
	            line: 54,
	            column: 71
	          }
	        }],
	        line: 54
	      }
	    },
	    s: {
	      '0': 0,
	      '1': 0,
	      '2': 0,
	      '3': 0,
	      '4': 0,
	      '5': 0,
	      '6': 0,
	      '7': 0,
	      '8': 0,
	      '9': 0,
	      '10': 0,
	      '11': 0,
	      '12': 0
	    },
	    f: {
	      '0': 0,
	      '1': 0,
	      '2': 0,
	      '3': 0,
	      '4': 0,
	      '5': 0
	    },
	    b: {
	      '0': [0, 0],
	      '1': [0, 0]
	    },
	    _coverageSchema: '332fd63041d2c1bcb487cc26dd0d5f7d97098a6c'
	  },
	      coverage = global[gcv] || (global[gcv] = {});

	  if (coverage[path] && coverage[path].hash === hash) {
	    return coverage[path];
	  }

	  coverageData.hash = hash;
	  return coverage[path] = coverageData;
	}();
	var actualCache = (cov_1ngy6na5sz.s[0]++, new window_1.Map());
	cov_1ngy6na5sz.s[1]++;

	var key = function key(_ref) {
	  var accountId = _ref.accountId,
	      playerId = _ref.playerId,
	      embedId = _ref.embedId;
	  cov_1ngy6na5sz.f[0]++;
	  cov_1ngy6na5sz.s[2]++;
	  return ((cov_1ngy6na5sz.b[0][0]++, accountId) || (cov_1ngy6na5sz.b[0][1]++, '*')) + "_" + playerId + "_" + embedId;
	};

	cov_1ngy6na5sz.s[3]++;

	var store = function store(props) {
	  cov_1ngy6na5sz.f[1]++;
	  cov_1ngy6na5sz.s[4]++;
	  actualCache.set(key(props), props.accountId ? (cov_1ngy6na5sz.b[1][0]++, urls.getUrl(props)) : (cov_1ngy6na5sz.b[1][1]++, ''));
	};

	cov_1ngy6na5sz.s[5]++;

	var has = function has(props) {
	  cov_1ngy6na5sz.f[2]++;
	  cov_1ngy6na5sz.s[6]++;
	  return actualCache.has(key(props));
	};

	cov_1ngy6na5sz.s[7]++;

	var get = function get(props) {
	  cov_1ngy6na5sz.f[3]++;
	  cov_1ngy6na5sz.s[8]++;
	  return actualCache.get(key(props));
	};

	cov_1ngy6na5sz.s[9]++;

	var clear = function clear() {
	  cov_1ngy6na5sz.f[4]++;
	  cov_1ngy6na5sz.s[10]++;
	  actualCache.clear();
	};

	cov_1ngy6na5sz.s[11]++;

	var forEach = function forEach(fn) {
	  cov_1ngy6na5sz.f[5]++;
	  cov_1ngy6na5sz.s[12]++;
	  actualCache.forEach(fn);
	};

	var playerScriptCache = {
	  clear: clear,
	  forEach: forEach,
	  get: get,
	  has: has,
	  key: key,
	  store: store
	};

	var cov_mxn7e3u6j = function () {
	  var path = '/Users/poneill/dev/player-loader/src/env.js',
	      hash = 'dea8617eecb98f2f6dc51a17a163e671f9a29c2a',
	      Function = function () {}.constructor,
	      global = new Function('return this')(),
	      gcv = '__coverage__',
	      coverageData = {
	    path: '/Users/poneill/dev/player-loader/src/env.js',
	    statementMap: {
	      '0': {
	        start: {
	          line: 5,
	          column: 27
	        },
	        end: {
	          line: 5,
	          column: 60
	        }
	      },
	      '1': {
	        start: {
	          line: 17,
	          column: 24
	        },
	        end: {
	          line: 18,
	          column: 81
	        }
	      },
	      '2': {
	        start: {
	          line: 18,
	          column: 2
	        },
	        end: {
	          line: 18,
	          column: 81
	        }
	      },
	      '3': {
	        start: {
	          line: 18,
	          column: 49
	        },
	        end: {
	          line: 18,
	          column: 75
	        }
	      },
	      '4': {
	        start: {
	          line: 27,
	          column: 22
	        },
	        end: {
	          line: 28,
	          column: 78
	        }
	      },
	      '5': {
	        start: {
	          line: 28,
	          column: 2
	        },
	        end: {
	          line: 28,
	          column: 78
	        }
	      },
	      '6': {
	        start: {
	          line: 28,
	          column: 34
	        },
	        end: {
	          line: 28,
	          column: 77
	        }
	      },
	      '7': {
	        start: {
	          line: 36,
	          column: 19
	        },
	        end: {
	          line: 47,
	          column: 1
	        }
	      },
	      '8': {
	        start: {
	          line: 37,
	          column: 2
	        },
	        end: {
	          line: 39,
	          column: 3
	        }
	      },
	      '9': {
	        start: {
	          line: 38,
	          column: 4
	        },
	        end: {
	          line: 38,
	          column: 11
	        }
	      },
	      '10': {
	        start: {
	          line: 40,
	          column: 2
	        },
	        end: {
	          line: 46,
	          column: 5
	        }
	      },
	      '11': {
	        start: {
	          line: 41,
	          column: 14
	        },
	        end: {
	          line: 41,
	          column: 32
	        }
	      },
	      '12': {
	        start: {
	          line: 43,
	          column: 4
	        },
	        end: {
	          line: 45,
	          column: 5
	        }
	      },
	      '13': {
	        start: {
	          line: 44,
	          column: 6
	        },
	        end: {
	          line: 44,
	          column: 18
	        }
	      },
	      '14': {
	        start: {
	          line: 55,
	          column: 14
	        },
	        end: {
	          line: 85,
	          column: 1
	        }
	      },
	      '15': {
	        start: {
	          line: 58,
	          column: 2
	        },
	        end: {
	          line: 69,
	          column: 5
	        }
	      },
	      '16': {
	        start: {
	          line: 61,
	          column: 4
	        },
	        end: {
	          line: 63,
	          column: 5
	        }
	      },
	      '17': {
	        start: {
	          line: 62,
	          column: 6
	        },
	        end: {
	          line: 62,
	          column: 13
	        }
	      },
	      '18': {
	        start: {
	          line: 66,
	          column: 4
	        },
	        end: {
	          line: 68,
	          column: 52
	        }
	      },
	      '19': {
	        start: {
	          line: 68,
	          column: 21
	        },
	        end: {
	          line: 68,
	          column: 50
	        }
	      },
	      '20': {
	        start: {
	          line: 72,
	          column: 2
	        },
	        end: {
	          line: 72,
	          column: 28
	        }
	      },
	      '21': {
	        start: {
	          line: 75,
	          column: 2
	        },
	        end: {
	          line: 75,
	          column: 29
	        }
	      },
	      '22': {
	        start: {
	          line: 79,
	          column: 2
	        },
	        end: {
	          line: 79,
	          column: 67
	        }
	      },
	      '23': {
	        start: {
	          line: 79,
	          column: 33
	        },
	        end: {
	          line: 79,
	          column: 65
	        }
	      },
	      '24': {
	        start: {
	          line: 82,
	          column: 2
	        },
	        end: {
	          line: 84,
	          column: 5
	        }
	      },
	      '25': {
	        start: {
	          line: 83,
	          column: 4
	        },
	        end: {
	          line: 83,
	          column: 21
	        }
	      },
	      '26': {
	        start: {
	          line: 92,
	          column: 22
	        },
	        end: {
	          line: 101,
	          column: 1
	        }
	      },
	      '27': {
	        start: {
	          line: 93,
	          column: 2
	        },
	        end: {
	          line: 100,
	          column: 5
	        }
	      },
	      '28': {
	        start: {
	          line: 94,
	          column: 20
	        },
	        end: {
	          line: 94,
	          column: 47
	        }
	      },
	      '29': {
	        start: {
	          line: 95,
	          column: 18
	        },
	        end: {
	          line: 95,
	          column: 61
	        }
	      },
	      '30': {
	        start: {
	          line: 97,
	          column: 4
	        },
	        end: {
	          line: 99,
	          column: 5
	        }
	      },
	      '31': {
	        start: {
	          line: 98,
	          column: 6
	        },
	        end: {
	          line: 98,
	          column: 37
	        }
	      }
	    },
	    fnMap: {
	      '0': {
	        name: '(anonymous_0)',
	        decl: {
	          start: {
	            line: 17,
	            column: 24
	          },
	          end: {
	            line: 17,
	            column: 25
	          }
	        },
	        loc: {
	          start: {
	            line: 18,
	            column: 2
	          },
	          end: {
	            line: 18,
	            column: 81
	          }
	        },
	        line: 18
	      },
	      '1': {
	        name: '(anonymous_1)',
	        decl: {
	          start: {
	            line: 18,
	            column: 44
	          },
	          end: {
	            line: 18,
	            column: 45
	          }
	        },
	        loc: {
	          start: {
	            line: 18,
	            column: 49
	          },
	          end: {
	            line: 18,
	            column: 75
	          }
	        },
	        line: 18
	      },
	      '2': {
	        name: '(anonymous_2)',
	        decl: {
	          start: {
	            line: 27,
	            column: 22
	          },
	          end: {
	            line: 27,
	            column: 23
	          }
	        },
	        loc: {
	          start: {
	            line: 28,
	            column: 2
	          },
	          end: {
	            line: 28,
	            column: 78
	          }
	        },
	        line: 28
	      },
	      '3': {
	        name: '(anonymous_3)',
	        decl: {
	          start: {
	            line: 28,
	            column: 29
	          },
	          end: {
	            line: 28,
	            column: 30
	          }
	        },
	        loc: {
	          start: {
	            line: 28,
	            column: 34
	          },
	          end: {
	            line: 28,
	            column: 77
	          }
	        },
	        line: 28
	      },
	      '4': {
	        name: '(anonymous_4)',
	        decl: {
	          start: {
	            line: 36,
	            column: 19
	          },
	          end: {
	            line: 36,
	            column: 20
	          }
	        },
	        loc: {
	          start: {
	            line: 36,
	            column: 32
	          },
	          end: {
	            line: 47,
	            column: 1
	          }
	        },
	        line: 36
	      },
	      '5': {
	        name: '(anonymous_5)',
	        decl: {
	          start: {
	            line: 40,
	            column: 39
	          },
	          end: {
	            line: 40,
	            column: 40
	          }
	        },
	        loc: {
	          start: {
	            line: 40,
	            column: 44
	          },
	          end: {
	            line: 46,
	            column: 3
	          }
	        },
	        line: 40
	      },
	      '6': {
	        name: '(anonymous_6)',
	        decl: {
	          start: {
	            line: 55,
	            column: 14
	          },
	          end: {
	            line: 55,
	            column: 15
	          }
	        },
	        loc: {
	          start: {
	            line: 55,
	            column: 20
	          },
	          end: {
	            line: 85,
	            column: 1
	          }
	        },
	        line: 55
	      },
	      '7': {
	        name: '(anonymous_7)',
	        decl: {
	          start: {
	            line: 58,
	            column: 28
	          },
	          end: {
	            line: 58,
	            column: 29
	          }
	        },
	        loc: {
	          start: {
	            line: 58,
	            column: 44
	          },
	          end: {
	            line: 69,
	            column: 3
	          }
	        },
	        line: 58
	      },
	      '8': {
	        name: '(anonymous_8)',
	        decl: {
	          start: {
	            line: 68,
	            column: 15
	          },
	          end: {
	            line: 68,
	            column: 16
	          }
	        },
	        loc: {
	          start: {
	            line: 68,
	            column: 21
	          },
	          end: {
	            line: 68,
	            column: 50
	          }
	        },
	        line: 68
	      },
	      '9': {
	        name: '(anonymous_9)',
	        decl: {
	          start: {
	            line: 79,
	            column: 28
	          },
	          end: {
	            line: 79,
	            column: 29
	          }
	        },
	        loc: {
	          start: {
	            line: 79,
	            column: 33
	          },
	          end: {
	            line: 79,
	            column: 65
	          }
	        },
	        line: 79
	      },
	      '10': {
	        name: '(anonymous_10)',
	        decl: {
	          start: {
	            line: 82,
	            column: 26
	          },
	          end: {
	            line: 82,
	            column: 27
	          }
	        },
	        loc: {
	          start: {
	            line: 82,
	            column: 31
	          },
	          end: {
	            line: 84,
	            column: 3
	          }
	        },
	        line: 82
	      },
	      '11': {
	        name: '(anonymous_11)',
	        decl: {
	          start: {
	            line: 92,
	            column: 22
	          },
	          end: {
	            line: 92,
	            column: 23
	          }
	        },
	        loc: {
	          start: {
	            line: 92,
	            column: 28
	          },
	          end: {
	            line: 101,
	            column: 1
	          }
	        },
	        line: 92
	      },
	      '12': {
	        name: '(anonymous_12)',
	        decl: {
	          start: {
	            line: 93,
	            column: 28
	          },
	          end: {
	            line: 93,
	            column: 29
	          }
	        },
	        loc: {
	          start: {
	            line: 93,
	            column: 33
	          },
	          end: {
	            line: 100,
	            column: 3
	          }
	        },
	        line: 93
	      }
	    },
	    branchMap: {
	      '0': {
	        loc: {
	          start: {
	            line: 18,
	            column: 2
	          },
	          end: {
	            line: 18,
	            column: 81
	          }
	        },
	        type: 'cond-expr',
	        locations: [{
	          start: {
	            line: 18,
	            column: 14
	          },
	          end: {
	            line: 18,
	            column: 76
	          }
	        }, {
	          start: {
	            line: 18,
	            column: 79
	          },
	          end: {
	            line: 18,
	            column: 81
	          }
	        }],
	        line: 18
	      },
	      '1': {
	        loc: {
	          start: {
	            line: 28,
	            column: 34
	          },
	          end: {
	            line: 28,
	            column: 77
	          }
	        },
	        type: 'binary-expr',
	        locations: [{
	          start: {
	            line: 28,
	            column: 34
	          },
	          end: {
	            line: 28,
	            column: 55
	          }
	        }, {
	          start: {
	            line: 28,
	            column: 59
	          },
	          end: {
	            line: 28,
	            column: 77
	          }
	        }],
	        line: 28
	      },
	      '2': {
	        loc: {
	          start: {
	            line: 37,
	            column: 2
	          },
	          end: {
	            line: 39,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 37,
	            column: 2
	          },
	          end: {
	            line: 39,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 37,
	            column: 2
	          },
	          end: {
	            line: 39,
	            column: 3
	          }
	        }],
	        line: 37
	      },
	      '3': {
	        loc: {
	          start: {
	            line: 43,
	            column: 4
	          },
	          end: {
	            line: 45,
	            column: 5
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 43,
	            column: 4
	          },
	          end: {
	            line: 45,
	            column: 5
	          }
	        }, {
	          start: {
	            line: 43,
	            column: 4
	          },
	          end: {
	            line: 45,
	            column: 5
	          }
	        }],
	        line: 43
	      },
	      '4': {
	        loc: {
	          start: {
	            line: 61,
	            column: 4
	          },
	          end: {
	            line: 63,
	            column: 5
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 61,
	            column: 4
	          },
	          end: {
	            line: 63,
	            column: 5
	          }
	        }, {
	          start: {
	            line: 61,
	            column: 4
	          },
	          end: {
	            line: 63,
	            column: 5
	          }
	        }],
	        line: 61
	      },
	      '5': {
	        loc: {
	          start: {
	            line: 97,
	            column: 4
	          },
	          end: {
	            line: 99,
	            column: 5
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 97,
	            column: 4
	          },
	          end: {
	            line: 99,
	            column: 5
	          }
	        }, {
	          start: {
	            line: 97,
	            column: 4
	          },
	          end: {
	            line: 99,
	            column: 5
	          }
	        }],
	        line: 97
	      }
	    },
	    s: {
	      '0': 0,
	      '1': 0,
	      '2': 0,
	      '3': 0,
	      '4': 0,
	      '5': 0,
	      '6': 0,
	      '7': 0,
	      '8': 0,
	      '9': 0,
	      '10': 0,
	      '11': 0,
	      '12': 0,
	      '13': 0,
	      '14': 0,
	      '15': 0,
	      '16': 0,
	      '17': 0,
	      '18': 0,
	      '19': 0,
	      '20': 0,
	      '21': 0,
	      '22': 0,
	      '23': 0,
	      '24': 0,
	      '25': 0,
	      '26': 0,
	      '27': 0,
	      '28': 0,
	      '29': 0,
	      '30': 0,
	      '31': 0
	    },
	    f: {
	      '0': 0,
	      '1': 0,
	      '2': 0,
	      '3': 0,
	      '4': 0,
	      '5': 0,
	      '6': 0,
	      '7': 0,
	      '8': 0,
	      '9': 0,
	      '10': 0,
	      '11': 0,
	      '12': 0
	    },
	    b: {
	      '0': [0, 0],
	      '1': [0, 0],
	      '2': [0, 0],
	      '3': [0, 0],
	      '4': [0, 0],
	      '5': [0, 0]
	    },
	    _coverageSchema: '332fd63041d2c1bcb487cc26dd0d5f7d97098a6c'
	  },
	      coverage = global[gcv] || (global[gcv] = {});

	  if (coverage[path] && coverage[path].hash === hash) {
	    return coverage[path];
	  }

	  coverageData.hash = hash;
	  return coverage[path] = coverageData;
	}();
	var REGEX_PLAYER_EMBED = (cov_mxn7e3u6j.s[0]++, /^([A-Za-z0-9]+)_([A-Za-z0-9]+)$/);
	cov_mxn7e3u6j.s[1]++;

	var getBcGlobalKeys = function getBcGlobalKeys() {
	  cov_mxn7e3u6j.f[0]++;
	  cov_mxn7e3u6j.s[2]++;
	  return window_1.bc ? (cov_mxn7e3u6j.b[0][0]++, Object.keys(window_1.bc).filter(function (k) {
	    cov_mxn7e3u6j.f[1]++;
	    cov_mxn7e3u6j.s[3]++;
	    return REGEX_PLAYER_EMBED.test(k);
	  })) : (cov_mxn7e3u6j.b[0][1]++, []);
	};

	cov_mxn7e3u6j.s[4]++;

	var getGlobalKeys = function getGlobalKeys() {
	  cov_mxn7e3u6j.f[2]++;
	  cov_mxn7e3u6j.s[5]++;
	  return Object.keys(window_1).filter(function (k) {
	    cov_mxn7e3u6j.f[3]++;
	    cov_mxn7e3u6j.s[6]++;
	    return (cov_mxn7e3u6j.b[1][0]++, /^videojs/i.test(k)) || (cov_mxn7e3u6j.b[1][1]++, /^(bc)$/.test(k));
	  });
	};

	cov_mxn7e3u6j.s[7]++;

	var disposeAll = function disposeAll(videojs) {
	  cov_mxn7e3u6j.f[4]++;
	  cov_mxn7e3u6j.s[8]++;

	  if (!videojs) {
	    cov_mxn7e3u6j.b[2][0]++;
	    cov_mxn7e3u6j.s[9]++;
	    return;
	  } else {
	    cov_mxn7e3u6j.b[2][1]++;
	  }

	  cov_mxn7e3u6j.s[10]++;
	  Object.keys(videojs.players).forEach(function (k) {
	    cov_mxn7e3u6j.f[5]++;
	    var p = (cov_mxn7e3u6j.s[11]++, videojs.players[k]);
	    cov_mxn7e3u6j.s[12]++;

	    if (p) {
	      cov_mxn7e3u6j.b[3][0]++;
	      cov_mxn7e3u6j.s[13]++;
	      p.dispose();
	    } else {
	      cov_mxn7e3u6j.b[3][1]++;
	    }
	  });
	};

	cov_mxn7e3u6j.s[14]++;

	var reset = function reset() {
	  cov_mxn7e3u6j.f[6]++;
	  cov_mxn7e3u6j.s[15]++;
	  playerScriptCache.forEach(function (value, key) {
	    cov_mxn7e3u6j.f[7]++;
	    cov_mxn7e3u6j.s[16]++;

	    if (!value) {
	      cov_mxn7e3u6j.b[4][0]++;
	      cov_mxn7e3u6j.s[17]++;
	      return;
	    } else {
	      cov_mxn7e3u6j.b[4][1]++;
	    }

	    cov_mxn7e3u6j.s[18]++;
	    Array.prototype.slice.call(document_1.querySelectorAll("script[src=\"" + value + "\"]")).forEach(function (el) {
	      cov_mxn7e3u6j.f[8]++;
	      cov_mxn7e3u6j.s[19]++;
	      return el.parentNode.removeChild(el);
	    });
	  });
	  cov_mxn7e3u6j.s[20]++;
	  playerScriptCache.clear();
	  cov_mxn7e3u6j.s[21]++;
	  disposeAll(window_1.videojs);
	  cov_mxn7e3u6j.s[22]++;
	  getBcGlobalKeys().forEach(function (k) {
	    cov_mxn7e3u6j.f[9]++;
	    cov_mxn7e3u6j.s[23]++;
	    return disposeAll(window_1.bc[k].videojs);
	  });
	  cov_mxn7e3u6j.s[24]++;
	  getGlobalKeys().forEach(function (k) {
	    cov_mxn7e3u6j.f[10]++;
	    cov_mxn7e3u6j.s[25]++;
	    delete window_1[k];
	  });
	};

	cov_mxn7e3u6j.s[26]++;

	var detectPlayers = function detectPlayers() {
	  cov_mxn7e3u6j.f[11]++;
	  cov_mxn7e3u6j.s[27]++;
	  getBcGlobalKeys().forEach(function (k) {
	    cov_mxn7e3u6j.f[12]++;
	    var matches = (cov_mxn7e3u6j.s[28]++, k.match(REGEX_PLAYER_EMBED));
	    var props = (cov_mxn7e3u6j.s[29]++, {
	      playerId: matches[1],
	      embedId: matches[2]
	    });
	    cov_mxn7e3u6j.s[30]++;

	    if (!playerScriptCache.has(props)) {
	      cov_mxn7e3u6j.b[5][0]++;
	      cov_mxn7e3u6j.s[31]++;
	      playerScriptCache.store(props);
	    } else {
	      cov_mxn7e3u6j.b[5][1]++;
	    }
	  });
	};

	var env = {
	  detectPlayers: detectPlayers,
	  reset: reset
	};

	var cov_21wu0ki2yg = function () {
	  var path = '/Users/poneill/dev/player-loader/src/index.js',
	      hash = '2dd3014bb3fdf79f3da51d09827dd34961e0a811',
	      Function = function () {}.constructor,
	      global = new Function('return this')(),
	      gcv = '__coverage__',
	      coverageData = {
	    path: '/Users/poneill/dev/player-loader/src/index.js',
	    statementMap: {
	      '0': {
	        start: {
	          line: 24,
	          column: 0
	        },
	        end: {
	          line: 24,
	          column: 20
	        }
	      },
	      '1': {
	        start: {
	          line: 36,
	          column: 13
	        },
	        end: {
	          line: 36,
	          column: 45
	        }
	      },
	      '2': {
	        start: {
	          line: 36,
	          column: 21
	        },
	        end: {
	          line: 36,
	          column: 45
	        }
	      },
	      '3': {
	        start: {
	          line: 48,
	          column: 25
	        },
	        end: {
	          line: 50,
	          column: 33
	        }
	      },
	      '4': {
	        start: {
	          line: 49,
	          column: 2
	        },
	        end: {
	          line: 50,
	          column: 33
	        }
	      },
	      '5': {
	        start: {
	          line: 62,
	          column: 23
	        },
	        end: {
	          line: 64,
	          column: 34
	        }
	      },
	      '6': {
	        start: {
	          line: 63,
	          column: 2
	        },
	        end: {
	          line: 64,
	          column: 34
	        }
	      },
	      '7': {
	        start: {
	          line: 76,
	          column: 26
	        },
	        end: {
	          line: 81,
	          column: 43
	        }
	      },
	      '8': {
	        start: {
	          line: 77,
	          column: 2
	        },
	        end: {
	          line: 81,
	          column: 43
	        }
	      },
	      '9': {
	        start: {
	          line: 98,
	          column: 20
	        },
	        end: {
	          line: 132,
	          column: 1
	        }
	      },
	      '10': {
	        start: {
	          line: 106,
	          column: 6
	        },
	        end: {
	          line: 106,
	          column: 12
	        }
	      },
	      '11': {
	        start: {
	          line: 108,
	          column: 2
	        },
	        end: {
	          line: 131,
	          column: 3
	        }
	      },
	      '12': {
	        start: {
	          line: 109,
	          column: 4
	        },
	        end: {
	          line: 109,
	          column: 45
	        }
	      },
	      '13': {
	        start: {
	          line: 111,
	          column: 9
	        },
	        end: {
	          line: 131,
	          column: 3
	        }
	      },
	      '14': {
	        start: {
	          line: 112,
	          column: 4
	        },
	        end: {
	          line: 112,
	          column: 74
	        }
	      },
	      '15': {
	        start: {
	          line: 114,
	          column: 9
	        },
	        end: {
	          line: 131,
	          column: 3
	        }
	      },
	      '16': {
	        start: {
	          line: 115,
	          column: 4
	        },
	        end: {
	          line: 115,
	          column: 55
	        }
	      },
	      '17': {
	        start: {
	          line: 117,
	          column: 9
	        },
	        end: {
	          line: 131,
	          column: 3
	        }
	      },
	      '18': {
	        start: {
	          line: 118,
	          column: 4
	        },
	        end: {
	          line: 118,
	          column: 63
	        }
	      },
	      '19': {
	        start: {
	          line: 120,
	          column: 9
	        },
	        end: {
	          line: 131,
	          column: 3
	        }
	      },
	      '20': {
	        start: {
	          line: 121,
	          column: 4
	        },
	        end: {
	          line: 121,
	          column: 90
	        }
	      },
	      '21': {
	        start: {
	          line: 123,
	          column: 9
	        },
	        end: {
	          line: 131,
	          column: 3
	        }
	      },
	      '22': {
	        start: {
	          line: 127,
	          column: 4
	        },
	        end: {
	          line: 127,
	          column: 137
	        }
	      },
	      '23': {
	        start: {
	          line: 129,
	          column: 9
	        },
	        end: {
	          line: 131,
	          column: 3
	        }
	      },
	      '24': {
	        start: {
	          line: 130,
	          column: 4
	        },
	        end: {
	          line: 130,
	          column: 59
	        }
	      },
	      '25': {
	        start: {
	          line: 145,
	          column: 23
	        },
	        end: {
	          line: 155,
	          column: 1
	        }
	      },
	      '26': {
	        start: {
	          line: 146,
	          column: 2
	        },
	        end: {
	          line: 148,
	          column: 3
	        }
	      },
	      '27': {
	        start: {
	          line: 147,
	          column: 4
	        },
	        end: {
	          line: 147,
	          column: 19
	        }
	      },
	      '28': {
	        start: {
	          line: 150,
	          column: 2
	        },
	        end: {
	          line: 152,
	          column: 3
	        }
	      },
	      '29': {
	        start: {
	          line: 151,
	          column: 4
	        },
	        end: {
	          line: 151,
	          column: 43
	        }
	      },
	      '30': {
	        start: {
	          line: 154,
	          column: 2
	        },
	        end: {
	          line: 154,
	          column: 14
	        }
	      },
	      '31': {
	        start: {
	          line: 176,
	          column: 19
	        },
	        end: {
	          line: 214,
	          column: 1
	        }
	      },
	      '32': {
	        start: {
	          line: 177,
	          column: 30
	        },
	        end: {
	          line: 177,
	          column: 36
	        }
	      },
	      '33': {
	        start: {
	          line: 178,
	          column: 13
	        },
	        end: {
	          line: 178,
	          column: 61
	        }
	      },
	      '34': {
	        start: {
	          line: 180,
	          column: 2
	        },
	        end: {
	          line: 182,
	          column: 3
	        }
	      },
	      '35': {
	        start: {
	          line: 181,
	          column: 4
	        },
	        end: {
	          line: 181,
	          column: 68
	        }
	      },
	      '36': {
	        start: {
	          line: 184,
	          column: 2
	        },
	        end: {
	          line: 184,
	          column: 34
	        }
	      },
	      '37': {
	        start: {
	          line: 188,
	          column: 2
	        },
	        end: {
	          line: 208,
	          column: 3
	        }
	      },
	      '38': {
	        start: {
	          line: 189,
	          column: 4
	        },
	        end: {
	          line: 189,
	          column: 39
	        }
	      },
	      '39': {
	        start: {
	          line: 193,
	          column: 4
	        },
	        end: {
	          line: 195,
	          column: 5
	        }
	      },
	      '40': {
	        start: {
	          line: 194,
	          column: 6
	        },
	        end: {
	          line: 194,
	          column: 41
	        }
	      },
	      '41': {
	        start: {
	          line: 197,
	          column: 18
	        },
	        end: {
	          line: 197,
	          column: 63
	        }
	      },
	      '42': {
	        start: {
	          line: 200,
	          column: 4
	        },
	        end: {
	          line: 205,
	          column: 5
	        }
	      },
	      '43': {
	        start: {
	          line: 201,
	          column: 6
	        },
	        end: {
	          line: 204,
	          column: 35
	        }
	      },
	      '44': {
	        start: {
	          line: 207,
	          column: 4
	        },
	        end: {
	          line: 207,
	          column: 38
	        }
	      },
	      '45': {
	        start: {
	          line: 210,
	          column: 2
	        },
	        end: {
	          line: 213,
	          column: 5
	        }
	      },
	      '46': {
	        start: {
	          line: 229,
	          column: 19
	        },
	        end: {
	          line: 276,
	          column: 1
	        }
	      },
	      '47': {
	        start: {
	          line: 230,
	          column: 2
	        },
	        end: {
	          line: 230,
	          column: 50
	        }
	      },
	      '48': {
	        start: {
	          line: 232,
	          column: 2
	        },
	        end: {
	          line: 232,
	          column: 22
	        }
	      },
	      '49': {
	        start: {
	          line: 234,
	          column: 35
	        },
	        end: {
	          line: 234,
	          column: 41
	        }
	      },
	      '50': {
	        start: {
	          line: 238,
	          column: 24
	        },
	        end: {
	          line: 238,
	          column: 42
	        }
	      },
	      '51': {
	        start: {
	          line: 239,
	          column: 16
	        },
	        end: {
	          line: 239,
	          column: 35
	        }
	      },
	      '52': {
	        start: {
	          line: 244,
	          column: 2
	        },
	        end: {
	          line: 250,
	          column: 3
	        }
	      },
	      '53': {
	        start: {
	          line: 245,
	          column: 4
	        },
	        end: {
	          line: 248,
	          column: 7
	        }
	      },
	      '54': {
	        start: {
	          line: 249,
	          column: 4
	        },
	        end: {
	          line: 249,
	          column: 11
	        }
	      },
	      '55': {
	        start: {
	          line: 255,
	          column: 2
	        },
	        end: {
	          line: 257,
	          column: 3
	        }
	      },
	      '56': {
	        start: {
	          line: 256,
	          column: 4
	        },
	        end: {
	          line: 256,
	          column: 54
	        }
	      },
	      '57': {
	        start: {
	          line: 259,
	          column: 17
	        },
	        end: {
	          line: 259,
	          column: 49
	        }
	      },
	      '58': {
	        start: {
	          line: 261,
	          column: 2
	        },
	        end: {
	          line: 261,
	          column: 67
	        }
	      },
	      '59': {
	        start: {
	          line: 261,
	          column: 24
	        },
	        end: {
	          line: 261,
	          column: 66
	        }
	      },
	      '60': {
	        start: {
	          line: 263,
	          column: 2
	        },
	        end: {
	          line: 265,
	          column: 4
	        }
	      },
	      '61': {
	        start: {
	          line: 264,
	          column: 4
	        },
	        end: {
	          line: 264,
	          column: 63
	        }
	      },
	      '62': {
	        start: {
	          line: 267,
	          column: 2
	        },
	        end: {
	          line: 267,
	          column: 22
	        }
	      },
	      '63': {
	        start: {
	          line: 268,
	          column: 2
	        },
	        end: {
	          line: 268,
	          column: 27
	        }
	      },
	      '64': {
	        start: {
	          line: 269,
	          column: 2
	        },
	        end: {
	          line: 269,
	          column: 35
	        }
	      },
	      '65': {
	        start: {
	          line: 271,
	          column: 2
	        },
	        end: {
	          line: 275,
	          column: 3
	        }
	      },
	      '66': {
	        start: {
	          line: 272,
	          column: 4
	        },
	        end: {
	          line: 272,
	          column: 38
	        }
	      },
	      '67': {
	        start: {
	          line: 274,
	          column: 4
	        },
	        end: {
	          line: 274,
	          column: 32
	        }
	      },
	      '68': {
	        start: {
	          line: 287,
	          column: 31
	        },
	        end: {
	          line: 305,
	          column: 1
	        }
	      },
	      '69': {
	        start: {
	          line: 288,
	          column: 17
	        },
	        end: {
	          line: 288,
	          column: 56
	        }
	      },
	      '70': {
	        start: {
	          line: 289,
	          column: 42
	        },
	        end: {
	          line: 289,
	          column: 48
	        }
	      },
	      '71': {
	        start: {
	          line: 293,
	          column: 2
	        },
	        end: {
	          line: 301,
	          column: 3
	        }
	      },
	      '72': {
	        start: {
	          line: 294,
	          column: 4
	        },
	        end: {
	          line: 300,
	          column: 6
	        }
	      },
	      '73': {
	        start: {
	          line: 298,
	          column: 8
	        },
	        end: {
	          line: 298,
	          column: 18
	        }
	      },
	      '74': {
	        start: {
	          line: 304,
	          column: 2
	        },
	        end: {
	          line: 304,
	          column: 79
	        }
	      },
	      '75': {
	        start: {
	          line: 304,
	          column: 42
	        },
	        end: {
	          line: 304,
	          column: 77
	        }
	      },
	      '76': {
	        start: {
	          line: 318,
	          column: 15
	        },
	        end: {
	          line: 325,
	          column: 1
	        }
	      },
	      '77': {
	        start: {
	          line: 319,
	          column: 2
	        },
	        end: {
	          line: 324,
	          column: 5
	        }
	      },
	      '78': {
	        start: {
	          line: 333,
	          column: 0
	        },
	        end: {
	          line: 333,
	          column: 46
	        }
	      },
	      '79': {
	        start: {
	          line: 333,
	          column: 27
	        },
	        end: {
	          line: 333,
	          column: 44
	        }
	      },
	      '80': {
	        start: {
	          line: 342,
	          column: 0
	        },
	        end: {
	          line: 344,
	          column: 3
	        }
	      },
	      '81': {
	        start: {
	          line: 343,
	          column: 2
	        },
	        end: {
	          line: 343,
	          column: 27
	        }
	      },
	      '82': {
	        start: {
	          line: 349,
	          column: 0
	        },
	        end: {
	          line: 349,
	          column: 52
	        }
	      },
	      '83': {
	        start: {
	          line: 349,
	          column: 30
	        },
	        end: {
	          line: 349,
	          column: 50
	        }
	      },
	      '84': {
	        start: {
	          line: 357,
	          column: 0
	        },
	        end: {
	          line: 357,
	          column: 35
	        }
	      },
	      '85': {
	        start: {
	          line: 357,
	          column: 22
	        },
	        end: {
	          line: 357,
	          column: 33
	        }
	      },
	      '86': {
	        start: {
	          line: 360,
	          column: 0
	        },
	        end: {
	          line: 373,
	          column: 3
	        }
	      },
	      '87': {
	        start: {
	          line: 372,
	          column: 2
	        },
	        end: {
	          line: 372,
	          column: 25
	        }
	      }
	    },
	    fnMap: {
	      '0': {
	        name: '(anonymous_0)',
	        decl: {
	          start: {
	            line: 36,
	            column: 13
	          },
	          end: {
	            line: 36,
	            column: 14
	          }
	        },
	        loc: {
	          start: {
	            line: 36,
	            column: 21
	          },
	          end: {
	            line: 36,
	            column: 45
	          }
	        },
	        line: 36
	      },
	      '1': {
	        name: '(anonymous_1)',
	        decl: {
	          start: {
	            line: 48,
	            column: 25
	          },
	          end: {
	            line: 48,
	            column: 26
	          }
	        },
	        loc: {
	          start: {
	            line: 49,
	            column: 2
	          },
	          end: {
	            line: 50,
	            column: 33
	          }
	        },
	        line: 49
	      },
	      '2': {
	        name: '(anonymous_2)',
	        decl: {
	          start: {
	            line: 62,
	            column: 23
	          },
	          end: {
	            line: 62,
	            column: 24
	          }
	        },
	        loc: {
	          start: {
	            line: 63,
	            column: 2
	          },
	          end: {
	            line: 64,
	            column: 34
	          }
	        },
	        line: 63
	      },
	      '3': {
	        name: '(anonymous_3)',
	        decl: {
	          start: {
	            line: 76,
	            column: 26
	          },
	          end: {
	            line: 76,
	            column: 27
	          }
	        },
	        loc: {
	          start: {
	            line: 77,
	            column: 2
	          },
	          end: {
	            line: 81,
	            column: 43
	          }
	        },
	        line: 77
	      },
	      '4': {
	        name: '(anonymous_4)',
	        decl: {
	          start: {
	            line: 98,
	            column: 20
	          },
	          end: {
	            line: 98,
	            column: 21
	          }
	        },
	        loc: {
	          start: {
	            line: 98,
	            column: 32
	          },
	          end: {
	            line: 132,
	            column: 1
	          }
	        },
	        line: 98
	      },
	      '5': {
	        name: '(anonymous_5)',
	        decl: {
	          start: {
	            line: 145,
	            column: 23
	          },
	          end: {
	            line: 145,
	            column: 24
	          }
	        },
	        loc: {
	          start: {
	            line: 145,
	            column: 36
	          },
	          end: {
	            line: 155,
	            column: 1
	          }
	        },
	        line: 145
	      },
	      '6': {
	        name: '(anonymous_6)',
	        decl: {
	          start: {
	            line: 176,
	            column: 19
	          },
	          end: {
	            line: 176,
	            column: 20
	          }
	        },
	        loc: {
	          start: {
	            line: 176,
	            column: 55
	          },
	          end: {
	            line: 214,
	            column: 1
	          }
	        },
	        line: 176
	      },
	      '7': {
	        name: '(anonymous_7)',
	        decl: {
	          start: {
	            line: 229,
	            column: 19
	          },
	          end: {
	            line: 229,
	            column: 20
	          }
	        },
	        loc: {
	          start: {
	            line: 229,
	            column: 48
	          },
	          end: {
	            line: 276,
	            column: 1
	          }
	        },
	        line: 229
	      },
	      '8': {
	        name: '(anonymous_8)',
	        decl: {
	          start: {
	            line: 261,
	            column: 18
	          },
	          end: {
	            line: 261,
	            column: 19
	          }
	        },
	        loc: {
	          start: {
	            line: 261,
	            column: 24
	          },
	          end: {
	            line: 261,
	            column: 66
	          }
	        },
	        line: 261
	      },
	      '9': {
	        name: '(anonymous_9)',
	        decl: {
	          start: {
	            line: 263,
	            column: 19
	          },
	          end: {
	            line: 263,
	            column: 20
	          }
	        },
	        loc: {
	          start: {
	            line: 263,
	            column: 25
	          },
	          end: {
	            line: 265,
	            column: 3
	          }
	        },
	        line: 263
	      },
	      '10': {
	        name: '(anonymous_10)',
	        decl: {
	          start: {
	            line: 287,
	            column: 31
	          },
	          end: {
	            line: 287,
	            column: 32
	          }
	        },
	        loc: {
	          start: {
	            line: 287,
	            column: 47
	          },
	          end: {
	            line: 305,
	            column: 1
	          }
	        },
	        line: 287
	      },
	      '11': {
	        name: '(anonymous_11)',
	        decl: {
	          start: {
	            line: 296,
	            column: 36
	          },
	          end: {
	            line: 296,
	            column: 37
	          }
	        },
	        loc: {
	          start: {
	            line: 296,
	            column: 42
	          },
	          end: {
	            line: 296,
	            column: 44
	          }
	        },
	        line: 296
	      },
	      '12': {
	        name: '(anonymous_12)',
	        decl: {
	          start: {
	            line: 297,
	            column: 36
	          },
	          end: {
	            line: 297,
	            column: 37
	          }
	        },
	        loc: {
	          start: {
	            line: 297,
	            column: 45
	          },
	          end: {
	            line: 299,
	            column: 7
	          }
	        },
	        line: 297
	      },
	      '13': {
	        name: '(anonymous_13)',
	        decl: {
	          start: {
	            line: 304,
	            column: 21
	          },
	          end: {
	            line: 304,
	            column: 22
	          }
	        },
	        loc: {
	          start: {
	            line: 304,
	            column: 42
	          },
	          end: {
	            line: 304,
	            column: 77
	          }
	        },
	        line: 304
	      },
	      '14': {
	        name: '(anonymous_14)',
	        decl: {
	          start: {
	            line: 318,
	            column: 15
	          },
	          end: {
	            line: 318,
	            column: 16
	          }
	        },
	        loc: {
	          start: {
	            line: 318,
	            column: 31
	          },
	          end: {
	            line: 325,
	            column: 1
	          }
	        },
	        line: 318
	      },
	      '15': {
	        name: '(anonymous_15)',
	        decl: {
	          start: {
	            line: 333,
	            column: 21
	          },
	          end: {
	            line: 333,
	            column: 22
	          }
	        },
	        loc: {
	          start: {
	            line: 333,
	            column: 27
	          },
	          end: {
	            line: 333,
	            column: 44
	          }
	        },
	        line: 333
	      },
	      '16': {
	        name: '(anonymous_16)',
	        decl: {
	          start: {
	            line: 342,
	            column: 21
	          },
	          end: {
	            line: 342,
	            column: 22
	          }
	        },
	        loc: {
	          start: {
	            line: 342,
	            column: 34
	          },
	          end: {
	            line: 344,
	            column: 1
	          }
	        },
	        line: 342
	      },
	      '17': {
	        name: '(anonymous_17)',
	        decl: {
	          start: {
	            line: 349,
	            column: 17
	          },
	          end: {
	            line: 349,
	            column: 18
	          }
	        },
	        loc: {
	          start: {
	            line: 349,
	            column: 30
	          },
	          end: {
	            line: 349,
	            column: 50
	          }
	        },
	        line: 349
	      },
	      '18': {
	        name: '(anonymous_18)',
	        decl: {
	          start: {
	            line: 357,
	            column: 16
	          },
	          end: {
	            line: 357,
	            column: 17
	          }
	        },
	        loc: {
	          start: {
	            line: 357,
	            column: 22
	          },
	          end: {
	            line: 357,
	            column: 33
	          }
	        },
	        line: 357
	      },
	      '19': {
	        name: '(anonymous_19)',
	        decl: {
	          start: {
	            line: 371,
	            column: 10
	          },
	          end: {
	            line: 371,
	            column: 11
	          }
	        },
	        loc: {
	          start: {
	            line: 371,
	            column: 17
	          },
	          end: {
	            line: 373,
	            column: 1
	          }
	        },
	        line: 371
	      }
	    },
	    branchMap: {
	      '0': {
	        loc: {
	          start: {
	            line: 49,
	            column: 2
	          },
	          end: {
	            line: 50,
	            column: 33
	          }
	        },
	        type: 'binary-expr',
	        locations: [{
	          start: {
	            line: 49,
	            column: 2
	          },
	          end: {
	            line: 49,
	            column: 34
	          }
	        }, {
	          start: {
	            line: 50,
	            column: 2
	          },
	          end: {
	            line: 50,
	            column: 33
	          }
	        }],
	        line: 49
	      },
	      '1': {
	        loc: {
	          start: {
	            line: 63,
	            column: 2
	          },
	          end: {
	            line: 64,
	            column: 34
	          }
	        },
	        type: 'binary-expr',
	        locations: [{
	          start: {
	            line: 63,
	            column: 2
	          },
	          end: {
	            line: 63,
	            column: 36
	          }
	        }, {
	          start: {
	            line: 64,
	            column: 2
	          },
	          end: {
	            line: 64,
	            column: 34
	          }
	        }],
	        line: 63
	      },
	      '2': {
	        loc: {
	          start: {
	            line: 77,
	            column: 2
	          },
	          end: {
	            line: 81,
	            column: 43
	          }
	        },
	        type: 'binary-expr',
	        locations: [{
	          start: {
	            line: 77,
	            column: 2
	          },
	          end: {
	            line: 77,
	            column: 42
	          }
	        }, {
	          start: {
	            line: 78,
	            column: 2
	          },
	          end: {
	            line: 78,
	            column: 43
	          }
	        }, {
	          start: {
	            line: 79,
	            column: 2
	          },
	          end: {
	            line: 79,
	            column: 42
	          }
	        }, {
	          start: {
	            line: 80,
	            column: 2
	          },
	          end: {
	            line: 80,
	            column: 41
	          }
	        }, {
	          start: {
	            line: 81,
	            column: 2
	          },
	          end: {
	            line: 81,
	            column: 43
	          }
	        }],
	        line: 77
	      },
	      '3': {
	        loc: {
	          start: {
	            line: 108,
	            column: 2
	          },
	          end: {
	            line: 131,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 108,
	            column: 2
	          },
	          end: {
	            line: 131,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 108,
	            column: 2
	          },
	          end: {
	            line: 131,
	            column: 3
	          }
	        }],
	        line: 108
	      },
	      '4': {
	        loc: {
	          start: {
	            line: 111,
	            column: 9
	          },
	          end: {
	            line: 131,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 111,
	            column: 9
	          },
	          end: {
	            line: 131,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 111,
	            column: 9
	          },
	          end: {
	            line: 131,
	            column: 3
	          }
	        }],
	        line: 111
	      },
	      '5': {
	        loc: {
	          start: {
	            line: 114,
	            column: 9
	          },
	          end: {
	            line: 131,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 114,
	            column: 9
	          },
	          end: {
	            line: 131,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 114,
	            column: 9
	          },
	          end: {
	            line: 131,
	            column: 3
	          }
	        }],
	        line: 114
	      },
	      '6': {
	        loc: {
	          start: {
	            line: 117,
	            column: 9
	          },
	          end: {
	            line: 131,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 117,
	            column: 9
	          },
	          end: {
	            line: 131,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 117,
	            column: 9
	          },
	          end: {
	            line: 131,
	            column: 3
	          }
	        }],
	        line: 117
	      },
	      '7': {
	        loc: {
	          start: {
	            line: 117,
	            column: 13
	          },
	          end: {
	            line: 117,
	            column: 55
	          }
	        },
	        type: 'binary-expr',
	        locations: [{
	          start: {
	            line: 117,
	            column: 13
	          },
	          end: {
	            line: 117,
	            column: 44
	          }
	        }, {
	          start: {
	            line: 117,
	            column: 48
	          },
	          end: {
	            line: 117,
	            column: 55
	          }
	        }],
	        line: 117
	      },
	      '8': {
	        loc: {
	          start: {
	            line: 120,
	            column: 9
	          },
	          end: {
	            line: 131,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 120,
	            column: 9
	          },
	          end: {
	            line: 131,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 120,
	            column: 9
	          },
	          end: {
	            line: 131,
	            column: 3
	          }
	        }],
	        line: 120
	      },
	      '9': {
	        loc: {
	          start: {
	            line: 120,
	            column: 13
	          },
	          end: {
	            line: 120,
	            column: 104
	          }
	        },
	        type: 'binary-expr',
	        locations: [{
	          start: {
	            line: 120,
	            column: 13
	          },
	          end: {
	            line: 120,
	            column: 25
	          }
	        }, {
	          start: {
	            line: 120,
	            column: 29
	          },
	          end: {
	            line: 120,
	            column: 63
	          }
	        }, {
	          start: {
	            line: 120,
	            column: 67
	          },
	          end: {
	            line: 120,
	            column: 104
	          }
	        }],
	        line: 120
	      },
	      '10': {
	        loc: {
	          start: {
	            line: 123,
	            column: 9
	          },
	          end: {
	            line: 131,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 123,
	            column: 9
	          },
	          end: {
	            line: 131,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 123,
	            column: 9
	          },
	          end: {
	            line: 131,
	            column: 3
	          }
	        }],
	        line: 123
	      },
	      '11': {
	        loc: {
	          start: {
	            line: 123,
	            column: 13
	          },
	          end: {
	            line: 126,
	            column: 70
	          }
	        },
	        type: 'binary-expr',
	        locations: [{
	          start: {
	            line: 123,
	            column: 13
	          },
	          end: {
	            line: 123,
	            column: 25
	          }
	        }, {
	          start: {
	            line: 124,
	            column: 13
	          },
	          end: {
	            line: 124,
	            column: 36
	          }
	        }, {
	          start: {
	            line: 125,
	            column: 13
	          },
	          end: {
	            line: 125,
	            column: 48
	          }
	        }, {
	          start: {
	            line: 126,
	            column: 13
	          },
	          end: {
	            line: 126,
	            column: 70
	          }
	        }],
	        line: 123
	      },
	      '12': {
	        loc: {
	          start: {
	            line: 129,
	            column: 9
	          },
	          end: {
	            line: 131,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 129,
	            column: 9
	          },
	          end: {
	            line: 131,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 129,
	            column: 9
	          },
	          end: {
	            line: 131,
	            column: 3
	          }
	        }],
	        line: 129
	      },
	      '13': {
	        loc: {
	          start: {
	            line: 146,
	            column: 2
	          },
	          end: {
	            line: 148,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 146,
	            column: 2
	          },
	          end: {
	            line: 148,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 146,
	            column: 2
	          },
	          end: {
	            line: 148,
	            column: 3
	          }
	        }],
	        line: 146
	      },
	      '14': {
	        loc: {
	          start: {
	            line: 150,
	            column: 2
	          },
	          end: {
	            line: 152,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 150,
	            column: 2
	          },
	          end: {
	            line: 152,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 150,
	            column: 2
	          },
	          end: {
	            line: 152,
	            column: 3
	          }
	        }],
	        line: 150
	      },
	      '15': {
	        loc: {
	          start: {
	            line: 178,
	            column: 13
	          },
	          end: {
	            line: 178,
	            column: 61
	          }
	        },
	        type: 'binary-expr',
	        locations: [{
	          start: {
	            line: 178,
	            column: 13
	          },
	          end: {
	            line: 178,
	            column: 48
	          }
	        }, {
	          start: {
	            line: 178,
	            column: 52
	          },
	          end: {
	            line: 178,
	            column: 61
	          }
	        }],
	        line: 178
	      },
	      '16': {
	        loc: {
	          start: {
	            line: 180,
	            column: 2
	          },
	          end: {
	            line: 182,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 180,
	            column: 2
	          },
	          end: {
	            line: 182,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 180,
	            column: 2
	          },
	          end: {
	            line: 182,
	            column: 3
	          }
	        }],
	        line: 180
	      },
	      '17': {
	        loc: {
	          start: {
	            line: 193,
	            column: 4
	          },
	          end: {
	            line: 195,
	            column: 5
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 193,
	            column: 4
	          },
	          end: {
	            line: 195,
	            column: 5
	          }
	        }, {
	          start: {
	            line: 193,
	            column: 4
	          },
	          end: {
	            line: 195,
	            column: 5
	          }
	        }],
	        line: 193
	      },
	      '18': {
	        loc: {
	          start: {
	            line: 200,
	            column: 4
	          },
	          end: {
	            line: 205,
	            column: 5
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 200,
	            column: 4
	          },
	          end: {
	            line: 205,
	            column: 5
	          }
	        }, {
	          start: {
	            line: 200,
	            column: 4
	          },
	          end: {
	            line: 205,
	            column: 5
	          }
	        }],
	        line: 200
	      },
	      '19': {
	        loc: {
	          start: {
	            line: 244,
	            column: 2
	          },
	          end: {
	            line: 250,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 244,
	            column: 2
	          },
	          end: {
	            line: 250,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 244,
	            column: 2
	          },
	          end: {
	            line: 250,
	            column: 3
	          }
	        }],
	        line: 244
	      },
	      '20': {
	        loc: {
	          start: {
	            line: 255,
	            column: 2
	          },
	          end: {
	            line: 257,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 255,
	            column: 2
	          },
	          end: {
	            line: 257,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 255,
	            column: 2
	          },
	          end: {
	            line: 257,
	            column: 3
	          }
	        }],
	        line: 255
	      },
	      '21': {
	        loc: {
	          start: {
	            line: 271,
	            column: 2
	          },
	          end: {
	            line: 275,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 271,
	            column: 2
	          },
	          end: {
	            line: 275,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 271,
	            column: 2
	          },
	          end: {
	            line: 275,
	            column: 3
	          }
	        }],
	        line: 271
	      },
	      '22': {
	        loc: {
	          start: {
	            line: 293,
	            column: 2
	          },
	          end: {
	            line: 301,
	            column: 3
	          }
	        },
	        type: 'if',
	        locations: [{
	          start: {
	            line: 293,
	            column: 2
	          },
	          end: {
	            line: 301,
	            column: 3
	          }
	        }, {
	          start: {
	            line: 293,
	            column: 2
	          },
	          end: {
	            line: 301,
	            column: 3
	          }
	        }],
	        line: 293
	      },
	      '23': {
	        loc: {
	          start: {
	            line: 293,
	            column: 6
	          },
	          end: {
	            line: 293,
	            column: 58
	          }
	        },
	        type: 'binary-expr',
	        locations: [{
	          start: {
	            line: 293,
	            column: 6
	          },
	          end: {
	            line: 293,
	            column: 20
	          }
	        }, {
	          start: {
	            line: 293,
	            column: 24
	          },
	          end: {
	            line: 293,
	            column: 39
	          }
	        }, {
	          start: {
	            line: 293,
	            column: 43
	          },
	          end: {
	            line: 293,
	            column: 58
	          }
	        }],
	        line: 293
	      },
	      '24': {
	        loc: {
	          start: {
	            line: 296,
	            column: 6
	          },
	          end: {
	            line: 296,
	            column: 44
	          }
	        },
	        type: 'cond-expr',
	        locations: [{
	          start: {
	            line: 296,
	            column: 24
	          },
	          end: {
	            line: 296,
	            column: 33
	          }
	        }, {
	          start: {
	            line: 296,
	            column: 36
	          },
	          end: {
	            line: 296,
	            column: 44
	          }
	        }],
	        line: 296
	      },
	      '25': {
	        loc: {
	          start: {
	            line: 297,
	            column: 6
	          },
	          end: {
	            line: 299,
	            column: 7
	          }
	        },
	        type: 'cond-expr',
	        locations: [{
	          start: {
	            line: 297,
	            column: 24
	          },
	          end: {
	            line: 297,
	            column: 33
	          }
	        }, {
	          start: {
	            line: 297,
	            column: 36
	          },
	          end: {
	            line: 299,
	            column: 7
	          }
	        }],
	        line: 297
	      }
	    },
	    s: {
	      '0': 0,
	      '1': 0,
	      '2': 0,
	      '3': 0,
	      '4': 0,
	      '5': 0,
	      '6': 0,
	      '7': 0,
	      '8': 0,
	      '9': 0,
	      '10': 0,
	      '11': 0,
	      '12': 0,
	      '13': 0,
	      '14': 0,
	      '15': 0,
	      '16': 0,
	      '17': 0,
	      '18': 0,
	      '19': 0,
	      '20': 0,
	      '21': 0,
	      '22': 0,
	      '23': 0,
	      '24': 0,
	      '25': 0,
	      '26': 0,
	      '27': 0,
	      '28': 0,
	      '29': 0,
	      '30': 0,
	      '31': 0,
	      '32': 0,
	      '33': 0,
	      '34': 0,
	      '35': 0,
	      '36': 0,
	      '37': 0,
	      '38': 0,
	      '39': 0,
	      '40': 0,
	      '41': 0,
	      '42': 0,
	      '43': 0,
	      '44': 0,
	      '45': 0,
	      '46': 0,
	      '47': 0,
	      '48': 0,
	      '49': 0,
	      '50': 0,
	      '51': 0,
	      '52': 0,
	      '53': 0,
	      '54': 0,
	      '55': 0,
	      '56': 0,
	      '57': 0,
	      '58': 0,
	      '59': 0,
	      '60': 0,
	      '61': 0,
	      '62': 0,
	      '63': 0,
	      '64': 0,
	      '65': 0,
	      '66': 0,
	      '67': 0,
	      '68': 0,
	      '69': 0,
	      '70': 0,
	      '71': 0,
	      '72': 0,
	      '73': 0,
	      '74': 0,
	      '75': 0,
	      '76': 0,
	      '77': 0,
	      '78': 0,
	      '79': 0,
	      '80': 0,
	      '81': 0,
	      '82': 0,
	      '83': 0,
	      '84': 0,
	      '85': 0,
	      '86': 0,
	      '87': 0
	    },
	    f: {
	      '0': 0,
	      '1': 0,
	      '2': 0,
	      '3': 0,
	      '4': 0,
	      '5': 0,
	      '6': 0,
	      '7': 0,
	      '8': 0,
	      '9': 0,
	      '10': 0,
	      '11': 0,
	      '12': 0,
	      '13': 0,
	      '14': 0,
	      '15': 0,
	      '16': 0,
	      '17': 0,
	      '18': 0,
	      '19': 0
	    },
	    b: {
	      '0': [0, 0],
	      '1': [0, 0],
	      '2': [0, 0, 0, 0, 0],
	      '3': [0, 0],
	      '4': [0, 0],
	      '5': [0, 0],
	      '6': [0, 0],
	      '7': [0, 0],
	      '8': [0, 0],
	      '9': [0, 0, 0],
	      '10': [0, 0],
	      '11': [0, 0, 0, 0],
	      '12': [0, 0],
	      '13': [0, 0],
	      '14': [0, 0],
	      '15': [0, 0],
	      '16': [0, 0],
	      '17': [0, 0],
	      '18': [0, 0],
	      '19': [0, 0],
	      '20': [0, 0],
	      '21': [0, 0],
	      '22': [0, 0],
	      '23': [0, 0, 0],
	      '24': [0, 0],
	      '25': [0, 0]
	    },
	    _coverageSchema: '332fd63041d2c1bcb487cc26dd0d5f7d97098a6c'
	  },
	      coverage = global[gcv] || (global[gcv] = {});

	  if (coverage[path] && coverage[path].hash === hash) {
	    return coverage[path];
	  }

	  coverageData.hash = hash;
	  return coverage[path] = coverageData;
	}();
	cov_21wu0ki2yg.s[0]++;
	env.detectPlayers();
	cov_21wu0ki2yg.s[1]++;

	var isFn = function isFn(fn) {
	  cov_21wu0ki2yg.f[0]++;
	  cov_21wu0ki2yg.s[2]++;
	  return typeof fn === 'function';
	};

	cov_21wu0ki2yg.s[3]++;

	var isValidEmbedType = function isValidEmbedType(embedType) {
	  cov_21wu0ki2yg.f[1]++;
	  cov_21wu0ki2yg.s[4]++;
	  return (cov_21wu0ki2yg.b[0][0]++, embedType === EMBED_TYPE_IN_PAGE) || (cov_21wu0ki2yg.b[0][1]++, embedType === EMBED_TYPE_IFRAME);
	};

	cov_21wu0ki2yg.s[5]++;

	var isValidTagName = function isValidTagName(tagName) {
	  cov_21wu0ki2yg.f[2]++;
	  cov_21wu0ki2yg.s[6]++;
	  return (cov_21wu0ki2yg.b[1][0]++, tagName === EMBED_TAG_NAME_VIDEOJS) || (cov_21wu0ki2yg.b[1][1]++, tagName === EMBED_TAG_NAME_VIDEO);
	};

	cov_21wu0ki2yg.s[7]++;

	var isValidRootInsert = function isValidRootInsert(refNodeInsert) {
	  cov_21wu0ki2yg.f[3]++;
	  cov_21wu0ki2yg.s[8]++;
	  return (cov_21wu0ki2yg.b[2][0]++, refNodeInsert === REF_NODE_INSERT_APPEND) || (cov_21wu0ki2yg.b[2][1]++, refNodeInsert === REF_NODE_INSERT_PREPEND) || (cov_21wu0ki2yg.b[2][2]++, refNodeInsert === REF_NODE_INSERT_BEFORE) || (cov_21wu0ki2yg.b[2][3]++, refNodeInsert === REF_NODE_INSERT_AFTER) || (cov_21wu0ki2yg.b[2][4]++, refNodeInsert === REF_NODE_INSERT_REPLACE);
	};

	cov_21wu0ki2yg.s[9]++;

	var checkParams = function checkParams(params) {
	  cov_21wu0ki2yg.f[4]++;

	  var _ref = (cov_21wu0ki2yg.s[10]++, params),
	      accountId = _ref.accountId,
	      embedOptions = _ref.embedOptions,
	      embedType = _ref.embedType,
	      options = _ref.options,
	      refNode = _ref.refNode,
	      refNodeInsert = _ref.refNodeInsert;

	  cov_21wu0ki2yg.s[11]++;

	  if (!accountId) {
	    cov_21wu0ki2yg.b[3][0]++;
	    cov_21wu0ki2yg.s[12]++;
	    throw new Error('accountId is required');
	  } else {
	    cov_21wu0ki2yg.b[3][1]++;
	    cov_21wu0ki2yg.s[13]++;

	    if (!isElInDom(refNode)) {
	      cov_21wu0ki2yg.b[4][0]++;
	      cov_21wu0ki2yg.s[14]++;
	      throw new Error('refNode must resolve to a node attached to the DOM');
	    } else {
	      cov_21wu0ki2yg.b[4][1]++;
	      cov_21wu0ki2yg.s[15]++;

	      if (!isValidEmbedType(embedType)) {
	        cov_21wu0ki2yg.b[5][0]++;
	        cov_21wu0ki2yg.s[16]++;
	        throw new Error('embedType is missing or invalid');
	      } else {
	        cov_21wu0ki2yg.b[5][1]++;
	        cov_21wu0ki2yg.s[17]++;

	        if ((cov_21wu0ki2yg.b[7][0]++, embedType === EMBED_TYPE_IFRAME) && (cov_21wu0ki2yg.b[7][1]++, options)) {
	          cov_21wu0ki2yg.b[6][0]++;
	          cov_21wu0ki2yg.s[18]++;
	          throw new Error('cannot use options with an iframe embed');
	        } else {
	          cov_21wu0ki2yg.b[6][1]++;
	          cov_21wu0ki2yg.s[19]++;

	          if ((cov_21wu0ki2yg.b[9][0]++, embedOptions) && (cov_21wu0ki2yg.b[9][1]++, embedOptions.tagName !== undefined) && (cov_21wu0ki2yg.b[9][2]++, !isValidTagName(embedOptions.tagName))) {
	            cov_21wu0ki2yg.b[8][0]++;
	            cov_21wu0ki2yg.s[20]++;
	            throw new Error("embedOptions.tagName is invalid (value: \"" + embedOptions.tagName + "\")");
	          } else {
	            cov_21wu0ki2yg.b[8][1]++;
	            cov_21wu0ki2yg.s[21]++;

	            if ((cov_21wu0ki2yg.b[11][0]++, embedOptions) && (cov_21wu0ki2yg.b[11][1]++, embedOptions.responsive) && (cov_21wu0ki2yg.b[11][2]++, embedOptions.responsive.aspectRatio) && (cov_21wu0ki2yg.b[11][3]++, !/^\d+\:\d+$/.test(embedOptions.responsive.aspectRatio))) {
	              cov_21wu0ki2yg.b[10][0]++;
	              cov_21wu0ki2yg.s[22]++;
	              throw new Error("embedOptions.responsive.aspectRatio must be in the \"n:n\" format (value: \"" + embedOptions.responsive.aspectRatio + "\")");
	            } else {
	              cov_21wu0ki2yg.b[10][1]++;
	              cov_21wu0ki2yg.s[23]++;

	              if (!isValidRootInsert(refNodeInsert)) {
	                cov_21wu0ki2yg.b[12][0]++;
	                cov_21wu0ki2yg.s[24]++;
	                throw new Error('refNodeInsert is missing or invalid');
	              } else {
	                cov_21wu0ki2yg.b[12][1]++;
	              }
	            }
	          }
	        }
	      }
	    }
	  }
	};

	cov_21wu0ki2yg.s[25]++;

	var resolveRefNode = function resolveRefNode(refNode) {
	  cov_21wu0ki2yg.f[5]++;
	  cov_21wu0ki2yg.s[26]++;

	  if (isElInDom(refNode)) {
	    cov_21wu0ki2yg.b[13][0]++;
	    cov_21wu0ki2yg.s[27]++;
	    return refNode;
	  } else {
	    cov_21wu0ki2yg.b[13][1]++;
	  }

	  cov_21wu0ki2yg.s[28]++;

	  if (typeof refNode === 'string') {
	    cov_21wu0ki2yg.b[14][0]++;
	    cov_21wu0ki2yg.s[29]++;
	    return document_1.querySelector(refNode);
	  } else {
	    cov_21wu0ki2yg.b[14][1]++;
	  }

	  cov_21wu0ki2yg.s[30]++;
	  return null;
	};

	cov_21wu0ki2yg.s[31]++;

	var initPlayer = function initPlayer(params, embed, resolve, reject) {
	  cov_21wu0ki2yg.f[6]++;

	  var _ref2 = (cov_21wu0ki2yg.s[32]++, params),
	      embedId = _ref2.embedId,
	      playerId = _ref2.playerId;

	  var bc = (cov_21wu0ki2yg.s[33]++, (cov_21wu0ki2yg.b[15][0]++, window_1.bc[playerId + "_" + embedId]) || (cov_21wu0ki2yg.b[15][1]++, window_1.bc));
	  cov_21wu0ki2yg.s[34]++;

	  if (!bc) {
	    cov_21wu0ki2yg.b[16][0]++;
	    cov_21wu0ki2yg.s[35]++;
	    return reject(new Error("missing bc function for " + playerId));
	  } else {
	    cov_21wu0ki2yg.b[16][1]++;
	  }

	  cov_21wu0ki2yg.s[36]++;
	  playerScriptCache.store(params);
	  var player;
	  cov_21wu0ki2yg.s[37]++;

	  try {
	    cov_21wu0ki2yg.s[38]++;
	    player = bc(embed, params.options);
	    cov_21wu0ki2yg.s[39]++;

	    if (player.bcinfo) {
	      cov_21wu0ki2yg.b[17][0]++;
	      cov_21wu0ki2yg.s[40]++;
	      player.bcinfo.PLAYER_LOADER = true;
	    } else {
	      cov_21wu0ki2yg.b[17][1]++;
	    }
	  } catch (x) {
	    var message = (cov_21wu0ki2yg.s[41]++, 'Could not initialize the Brightcove Player.');
	    cov_21wu0ki2yg.s[42]++;

	    if (params.embedOptions.tagName === EMBED_TAG_NAME_VIDEOJS) {
	      cov_21wu0ki2yg.b[18][0]++;
	      cov_21wu0ki2yg.s[43]++;
	      message += ' You are attempting to embed using a "video-js" element.' + ' Please ensure that your Player is v6.11.0 or newer in order to' + ' support this embed type. Alternatively, pass `"video"` for' + ' `embedOptions.tagName`.';
	    } else {
	      cov_21wu0ki2yg.b[18][1]++;
	    }

	    cov_21wu0ki2yg.s[44]++;
	    return reject(new Error(message));
	  }

	  cov_21wu0ki2yg.s[45]++;
	  resolve({
	    type: EMBED_TYPE_IN_PAGE,
	    ref: player
	  });
	};

	cov_21wu0ki2yg.s[46]++;

	var loadPlayer = function loadPlayer(params, resolve, reject) {
	  cov_21wu0ki2yg.f[7]++;
	  cov_21wu0ki2yg.s[47]++;
	  params.refNode = resolveRefNode(params.refNode);
	  cov_21wu0ki2yg.s[48]++;
	  checkParams(params);

	  var _ref3 = (cov_21wu0ki2yg.s[49]++, params),
	      refNode = _ref3.refNode,
	      refNodeInsert = _ref3.refNodeInsert;

	  var refNodeParent = (cov_21wu0ki2yg.s[50]++, refNode.parentNode);
	  var embed = (cov_21wu0ki2yg.s[51]++, createEmbed(params));
	  cov_21wu0ki2yg.s[52]++;

	  if (params.embedType === EMBED_TYPE_IFRAME) {
	    cov_21wu0ki2yg.b[19][0]++;
	    cov_21wu0ki2yg.s[53]++;
	    resolve({
	      type: EMBED_TYPE_IFRAME,
	      ref: embed
	    });
	    cov_21wu0ki2yg.s[54]++;
	    return;
	  } else {
	    cov_21wu0ki2yg.b[19][1]++;
	  }

	  cov_21wu0ki2yg.s[55]++;

	  if (playerScriptCache.has(params)) {
	    cov_21wu0ki2yg.b[20][0]++;
	    cov_21wu0ki2yg.s[56]++;
	    return initPlayer(params, embed, resolve, reject);
	  } else {
	    cov_21wu0ki2yg.b[20][1]++;
	  }

	  var script = (cov_21wu0ki2yg.s[57]++, document_1.createElement('script'));
	  cov_21wu0ki2yg.s[58]++;

	  script.onload = function () {
	    cov_21wu0ki2yg.f[8]++;
	    cov_21wu0ki2yg.s[59]++;
	    return initPlayer(params, embed, resolve, reject);
	  };

	  cov_21wu0ki2yg.s[60]++;

	  script.onerror = function () {
	    cov_21wu0ki2yg.f[9]++;
	    cov_21wu0ki2yg.s[61]++;
	    reject(new Error('player script could not be downloaded'));
	  };

	  cov_21wu0ki2yg.s[62]++;
	  script.async = true;
	  cov_21wu0ki2yg.s[63]++;
	  script.charset = 'utf-8';
	  cov_21wu0ki2yg.s[64]++;
	  script.src = urls.getUrl(params);
	  cov_21wu0ki2yg.s[65]++;

	  if (refNodeInsert === REF_NODE_INSERT_REPLACE) {
	    cov_21wu0ki2yg.b[21][0]++;
	    cov_21wu0ki2yg.s[66]++;
	    refNodeParent.appendChild(script);
	  } else {
	    cov_21wu0ki2yg.b[21][1]++;
	    cov_21wu0ki2yg.s[67]++;
	    refNode.appendChild(script);
	  }
	};

	cov_21wu0ki2yg.s[68]++;

	var brightcovePlayerLoader = function brightcovePlayerLoader(parameters) {
	  cov_21wu0ki2yg.f[10]++;
	  var params = (cov_21wu0ki2yg.s[69]++, _extends({}, DEFAULTS, parameters));

	  var _ref4 = (cov_21wu0ki2yg.s[70]++, params),
	      Promise = _ref4.Promise,
	      onSuccess = _ref4.onSuccess,
	      onFailure = _ref4.onFailure;

	  cov_21wu0ki2yg.s[71]++;

	  if ((cov_21wu0ki2yg.b[23][0]++, !isFn(Promise)) || (cov_21wu0ki2yg.b[23][1]++, isFn(onSuccess)) || (cov_21wu0ki2yg.b[23][2]++, isFn(onFailure))) {
	    cov_21wu0ki2yg.b[22][0]++;
	    cov_21wu0ki2yg.s[72]++;
	    return loadPlayer(params, isFn(onSuccess) ? (cov_21wu0ki2yg.b[24][0]++, onSuccess) : (cov_21wu0ki2yg.b[24][1]++, function () {
	      cov_21wu0ki2yg.f[11]++;
	    }), isFn(onFailure) ? (cov_21wu0ki2yg.b[25][0]++, onFailure) : (cov_21wu0ki2yg.b[25][1]++, function (err) {
	      cov_21wu0ki2yg.f[12]++;
	      cov_21wu0ki2yg.s[73]++;
	      throw err;
	    }));
	  } else {
	    cov_21wu0ki2yg.b[22][1]++;
	  }

	  cov_21wu0ki2yg.s[74]++;
	  return new Promise(function (resolve, reject) {
	    cov_21wu0ki2yg.f[13]++;
	    cov_21wu0ki2yg.s[75]++;
	    return loadPlayer(params, resolve, reject);
	  });
	};

	cov_21wu0ki2yg.s[76]++;

	var expose = function expose(key, value) {
	  cov_21wu0ki2yg.f[14]++;
	  cov_21wu0ki2yg.s[77]++;
	  Object.defineProperty(brightcovePlayerLoader, key, {
	    configurable: false,
	    enumerable: true,
	    value: value,
	    writable: false
	  });
	};

	cov_21wu0ki2yg.s[78]++;
	expose('getBaseUrl', function () {
	  cov_21wu0ki2yg.f[15]++;
	  cov_21wu0ki2yg.s[79]++;
	  return urls.getBaseUrl();
	});
	cov_21wu0ki2yg.s[80]++;
	expose('setBaseUrl', function (baseUrl) {
	  cov_21wu0ki2yg.f[16]++;
	  cov_21wu0ki2yg.s[81]++;
	  urls.setBaseUrl(baseUrl);
	});
	cov_21wu0ki2yg.s[82]++;
	expose('getUrl', function (options) {
	  cov_21wu0ki2yg.f[17]++;
	  cov_21wu0ki2yg.s[83]++;
	  return urls.getUrl(options);
	});
	cov_21wu0ki2yg.s[84]++;
	expose('reset', function () {
	  cov_21wu0ki2yg.f[18]++;
	  cov_21wu0ki2yg.s[85]++;
	  return env.reset();
	});
	cov_21wu0ki2yg.s[86]++;
	[['EMBED_TAG_NAME_VIDEO', EMBED_TAG_NAME_VIDEO], ['EMBED_TAG_NAME_VIDEOJS', EMBED_TAG_NAME_VIDEOJS], ['EMBED_TYPE_IN_PAGE', EMBED_TYPE_IN_PAGE], ['EMBED_TYPE_IFRAME', EMBED_TYPE_IFRAME], ['REF_NODE_INSERT_APPEND', REF_NODE_INSERT_APPEND], ['REF_NODE_INSERT_PREPEND', REF_NODE_INSERT_PREPEND], ['REF_NODE_INSERT_BEFORE', REF_NODE_INSERT_BEFORE], ['REF_NODE_INSERT_AFTER', REF_NODE_INSERT_AFTER], ['REF_NODE_INSERT_REPLACE', REF_NODE_INSERT_REPLACE], ['VERSION', version$1]].forEach(function (arr) {
	  cov_21wu0ki2yg.f[19]++;
	  cov_21wu0ki2yg.s[87]++;
	  expose(arr[0], arr[1]);
	});

	QUnit.test('the environment is sane', function (assert) {
	  assert.strictEqual(typeof Array.isArray, 'function', 'es5 exists');
	  assert.strictEqual(typeof sinon, 'object', 'sinon exists');
	  assert.strictEqual(typeof brightcovePlayerLoader, 'function', 'brightcovePlayerLoader is a function');
	});
	QUnit.module('brightcove-player-loader', function (hooks) {
	  var originalBaseUrl = urls.getBaseUrl();
	  hooks.before(function () {
	    urls.setBaseUrl(window_1.location.origin + "/vendor/");
	  });
	  hooks.beforeEach(function () {
	    this.fixture = document_1.getElementById('qunit-fixture');
	  });
	  hooks.afterEach(function () {
	    brightcovePlayerLoader.reset();
	  });
	  hooks.after(function () {
	    urls.setBaseUrl(originalBaseUrl);
	  });
	  QUnit.test('exposes several constant values', function (assert) {
	    ['EMBED_TAG_NAME_VIDEO', 'EMBED_TAG_NAME_VIDEOJS', 'EMBED_TYPE_IN_PAGE', 'EMBED_TYPE_IFRAME', 'REF_NODE_INSERT_APPEND', 'REF_NODE_INSERT_PREPEND', 'REF_NODE_INSERT_BEFORE', 'REF_NODE_INSERT_AFTER', 'REF_NODE_INSERT_REPLACE', 'VERSION'].forEach(function (k) {
	      assert.ok(brightcovePlayerLoader.hasOwnProperty(k), k + " exists");
	    });
	  });
	  QUnit.test('exposes several methods', function (assert) {
	    ['getBaseUrl', 'setBaseUrl', 'reset'].forEach(function (k) {
	      assert.strictEqual(typeof brightcovePlayerLoader[k], 'function', k + " is a function");
	    });
	  });
	  QUnit.test('default/minimal usage', function (assert) {
	    var done = assert.async();
	    assert.expect(2);
	    brightcovePlayerLoader({
	      accountId: '1',
	      refNode: this.fixture,
	      onEmbedCreated: function onEmbedCreated(embed) {
	        embed.id = 'derp';
	      }
	    }).then(function (success) {
	      assert.strictEqual(success.type, brightcovePlayerLoader.EMBED_TYPE_IN_PAGE, 'the expected embed type was passed through the Promise');
	      assert.strictEqual(success.ref, window_1.videojs.players.derp, 'the expected player was passed through the Promise');
	      done();
	    }).catch(done);
	  });
	  QUnit.test('usage inpage & playerUrl', function (assert) {
	    var done = assert.async();
	    assert.expect(2);
	    brightcovePlayerLoader({
	      accountId: '1',
	      refNode: this.fixture,
	      playerUrl: window_1.location.origin + "/vendor/1/default_default/index.min.js",
	      onEmbedCreated: function onEmbedCreated(embed) {
	        embed.id = 'derp';
	      }
	    }).then(function (success) {
	      assert.strictEqual(success.type, brightcovePlayerLoader.EMBED_TYPE_IN_PAGE, 'the expected embed type was passed through the Promise');
	      assert.strictEqual(success.ref, window_1.videojs.players.derp, 'the expected player was passed through the Promise');
	      done();
	    }).catch(done);
	  });
	  QUnit.test('usage iframe & playerUrl', function (assert) {
	    var _this = this;

	    var done = assert.async();
	    assert.expect(3);
	    brightcovePlayerLoader({
	      accountId: '1',
	      refNode: this.fixture,
	      embedType: brightcovePlayerLoader.EMBED_TYPE_IFRAME,
	      playerUrl: window_1.location.origin + "/vendor/1/default_default/index.html",
	      onEmbedCreated: function onEmbedCreated(embed) {
	        embed.id = 'derp';
	      }
	    }).then(function (success) {
	      assert.strictEqual(success.type, brightcovePlayerLoader.EMBED_TYPE_IFRAME, 'the expected embed type was passed through the Promise');
	      assert.strictEqual(success.ref.nodeType, 1, 'it is a DOM node');
	      assert.strictEqual(success.ref.parentNode, _this.fixture, 'it is in the DOM where we expect it');
	      done();
	    }).catch(done);
	  });
	  QUnit.test('default/minimal usage - with refNode as string', function (assert) {
	    var done = assert.async();
	    assert.expect(2);
	    brightcovePlayerLoader({
	      accountId: '1',
	      refNode: '#qunit-fixture',
	      onEmbedCreated: function onEmbedCreated(embed) {
	        embed.id = 'derp';
	      }
	    }).then(function (success) {
	      assert.strictEqual(success.type, brightcovePlayerLoader.EMBED_TYPE_IN_PAGE, 'the expected embed type was passed through the Promise');
	      assert.strictEqual(success.ref, window_1.videojs.players.derp, 'the expected player was passed through the Promise');
	      done();
	    }).catch(done);
	  });
	  QUnit.test('default/minimal usage - with refNodeInsert as "replace"', function (assert) {
	    var done = assert.async();
	    assert.expect(2);
	    brightcovePlayerLoader({
	      accountId: '1',
	      refNode: '#qunit-fixture',
	      onEmbedCreated: function onEmbedCreated(embed) {
	        embed.id = 'derp';
	      }
	    }).then(function (success) {
	      assert.strictEqual(success.type, brightcovePlayerLoader.EMBED_TYPE_IN_PAGE, 'the expected embed type was passed through the Promise');
	      assert.strictEqual(success.ref, window_1.videojs.players.derp, 'the expected player was passed through the Promise');
	      done();
	    }).catch(done);
	  });
	  QUnit.test('default/minimal usage - with callbacks instead of Promises', function (assert) {
	    var done = assert.async();
	    assert.expect(3);
	    var result = brightcovePlayerLoader({
	      accountId: '1',
	      refNode: this.fixture,
	      onEmbedCreated: function onEmbedCreated(embed) {
	        embed.id = 'derp';
	      },
	      onFailure: function onFailure() {
	        done();
	      },
	      onSuccess: function onSuccess(success) {
	        assert.strictEqual(success.type, brightcovePlayerLoader.EMBED_TYPE_IN_PAGE, 'the expected embed type was passed through the Promise');
	        assert.strictEqual(success.ref, window_1.videojs.players.derp, 'the expected player was passed through the Promise');
	        assert.strictEqual(result, undefined, 'no Promise was returned');
	        done();
	      }
	    });
	  });
	  QUnit.test('iframes resolve with a DOM element', function (assert) {
	    var _this2 = this;

	    var done = assert.async();
	    assert.expect(3);
	    brightcovePlayerLoader({
	      accountId: '1',
	      embedType: brightcovePlayerLoader.EMBED_TYPE_IFRAME,
	      refNode: this.fixture,
	      onEmbedCreated: function onEmbedCreated(embed) {
	        embed.id = 'derp';
	      }
	    }).then(function (success) {
	      assert.strictEqual(success.type, brightcovePlayerLoader.EMBED_TYPE_IFRAME, 'the expected embed type was passed through the Promise');
	      assert.strictEqual(success.ref.nodeType, 1, 'it is a DOM node');
	      assert.strictEqual(success.ref.parentNode, _this2.fixture, 'it is in the DOM where we expect it');
	      done();
	    }).catch(done);
	  });
	  QUnit.test('iframes resolve with a DOM element - with callbacks instead of Promises', function (assert) {
	    var _this3 = this;

	    var done = assert.async();
	    assert.expect(4);
	    var result = brightcovePlayerLoader({
	      accountId: '1',
	      embedType: brightcovePlayerLoader.EMBED_TYPE_IFRAME,
	      refNode: this.fixture,
	      onEmbedCreated: function onEmbedCreated(embed) {
	        embed.id = 'derp';
	      },
	      onFailure: function onFailure() {
	        done();
	      },
	      onSuccess: function onSuccess(success) {
	        assert.strictEqual(success.type, brightcovePlayerLoader.EMBED_TYPE_IFRAME, 'the expected embed type was passed through the Promise');
	        assert.strictEqual(success.ref.nodeType, 1, 'it is a DOM node');
	        assert.strictEqual(success.ref.parentNode, _this3.fixture, 'it is in the DOM where we expect it');
	        assert.strictEqual(result, undefined, 'no Promise was returned');
	        done();
	      }
	    });
	  });
	  QUnit.test('does not re-download scripts it already has', function (assert) {
	    var _this4 = this;

	    var done = assert.async();
	    assert.expect(2);
	    brightcovePlayerLoader({
	      accountId: '1',
	      refNode: this.fixture
	    }) // When the first player download is completed, immediately embed the
	    // same player again.
	    .then(function (success) {
	      return brightcovePlayerLoader({
	        accountId: '1',
	        refNode: _this4.fixture
	      });
	    }).then(function (success) {
	      assert.strictEqual(_this4.fixture.querySelectorAll('script').length, 1, 'only one script was created');
	      assert.strictEqual(_this4.fixture.querySelectorAll('.video-js').length, 2, 'but there are two players');
	      done();
	    }).catch(done);
	  });
	  QUnit.test('brightcovePlayerLoader.reset', function (assert) {
	    var _this5 = this;

	    var done = assert.async();
	    var firstPlayer;
	    assert.expect(14);
	    brightcovePlayerLoader({
	      accountId: '1',
	      refNode: this.fixture
	    }).then(function (success) {
	      firstPlayer = success.ref;
	      return brightcovePlayerLoader({
	        accountId: '1',
	        playerId: '2',
	        embedId: '3',
	        refNode: _this5.fixture
	      });
	    }).then(function (success) {
	      var a = firstPlayer;
	      var b = success.ref;
	      firstPlayer = null;
	      assert.ok(window_1.bc, 'bc exists');
	      assert.ok(window_1.videojs, 'videojs exists');
	      assert.ok(window_1.bc.videojs, 'bc.videojs exists');
	      assert.ok(window_1.bc.default_default, 'bc.default_default exists');
	      assert.ok(window_1.bc.default_default.videojs, 'bc.default_default.videojs exists');
	      assert.ok(window_1.bc['2_3'], 'bc.2_3 exists');
	      assert.ok(window_1.bc['2_3'].videojs, 'bc.2_3.videojs exists');
	      assert.strictEqual(a.el().parentNode, _this5.fixture, 'player A is in the DOM');
	      assert.strictEqual(b.el().parentNode, _this5.fixture, 'player B is in the DOM');
	      brightcovePlayerLoader.reset();
	      assert.notOk(window_1.bc, 'bc is gone');
	      assert.notOk(window_1.videojs, 'videojs is gone');
	      assert.strictEqual(a.el(), null, 'player A is disposed');
	      assert.strictEqual(b.el(), null, 'player B is disposed');
	      assert.notOk(_this5.fixture.hasChildNodes(), 'no more players or scripts in the fixture');
	      done();
	    }).catch(done);
	  });
	  QUnit.module('error states');
	  QUnit.test('accountId is required', function (assert) {
	    assert.rejects(brightcovePlayerLoader(), new Error('accountId is required'));
	  });
	  QUnit.test('refNode must resolve to a node attached to the DOM', function (assert) {
	    assert.rejects(brightcovePlayerLoader({
	      accountId: '1'
	    }), new Error('refNode must resolve to a node attached to the DOM'));
	    assert.rejects(brightcovePlayerLoader({
	      accountId: '1',
	      refNode: true
	    }), new Error('refNode must resolve to a node attached to the DOM'));
	    assert.rejects(brightcovePlayerLoader({
	      accountId: '1',
	      refNode: document_1.createElement('div')
	    }), new Error('refNode must resolve to a node attached to the DOM'));
	  });
	  QUnit.test('embedType is missing or invalid', function (assert) {
	    assert.rejects(brightcovePlayerLoader({
	      accountId: '1',
	      refNode: this.fixture,
	      embedType: ''
	    }), new Error('embedType is missing or invalid'));
	    assert.rejects(brightcovePlayerLoader({
	      accountId: '1',
	      refNode: this.fixture,
	      embedType: 'asdf'
	    }), new Error('embedType is missing or invalid'));
	    assert.rejects(brightcovePlayerLoader({
	      accountId: '1',
	      refNode: this.fixture,
	      embedType: null
	    }), new Error('embedType is missing or invalid'));
	  });
	  QUnit.test('cannot use options with an iframe embed', function (assert) {
	    assert.rejects(brightcovePlayerLoader({
	      accountId: '1',
	      refNode: this.fixture,
	      embedType: brightcovePlayerLoader.EMBED_TYPE_IFRAME,
	      options: {}
	    }), new Error('cannot use options with an iframe embed'));
	  });
	  QUnit.test('embedOptions.tagName is invalid', function (assert) {
	    assert.rejects(brightcovePlayerLoader({
	      accountId: '1',
	      refNode: this.fixture,
	      embedOptions: {
	        tagName: 'doh'
	      }
	    }), new Error('embedOptions.tagName is invalid (value: "doh")'));
	  });
	  QUnit.test('embedOptions.responsive.aspectRatio must be in the "n:n" format', function (assert) {
	    assert.rejects(brightcovePlayerLoader({
	      accountId: '1',
	      refNode: this.fixture,
	      embedOptions: {
	        responsive: {
	          aspectRatio: 'asdf'
	        }
	      }
	    }), new Error('embedOptions.responsive.aspectRatio must be in the "n:n" format (value: "asdf")'));
	  });
	  QUnit.test('refNodeInsert is missing or invalid', function (assert) {
	    assert.rejects(brightcovePlayerLoader({
	      accountId: '1',
	      refNode: this.fixture,
	      refNodeInsert: ''
	    }), new Error('refNodeInsert is missing or invalid'));
	    assert.rejects(brightcovePlayerLoader({
	      accountId: '1',
	      refNode: this.fixture,
	      refNodeInsert: 'asdf'
	    }), new Error('refNodeInsert is missing or invalid'));
	    assert.rejects(brightcovePlayerLoader({
	      accountId: '1',
	      refNode: this.fixture,
	      refNodeInsert: null
	    }), new Error('refNodeInsert is missing or invalid'));
	  });
	});

	QUnit.module('playerScriptCache', function (hooks) {
	  hooks.afterEach(function () {
	    playerScriptCache.clear();
	  });
	  QUnit.test('key', function (assert) {
	    assert.strictEqual(playerScriptCache.key({}), '*_undefined_undefined');
	    assert.strictEqual(playerScriptCache.key({
	      playerId: '1',
	      embedId: '2'
	    }), '*_1_2');
	    assert.strictEqual(playerScriptCache.key({
	      accountId: '0',
	      playerId: '1',
	      embedId: '2'
	    }), '0_1_2');
	  });
	  QUnit.test('store/has/get', function (assert) {
	    var a = {};
	    var b = {
	      playerId: '1',
	      embedId: '2'
	    };
	    var c = {
	      accountId: '0',
	      playerId: '1',
	      embedId: '2'
	    };
	    assert.notOk(playerScriptCache.has(a));
	    playerScriptCache.store(a);
	    assert.ok(playerScriptCache.has(a));
	    assert.strictEqual(playerScriptCache.get(a), '');
	    assert.notOk(playerScriptCache.has(b));
	    playerScriptCache.store(b);
	    assert.ok(playerScriptCache.has(b));
	    assert.strictEqual(playerScriptCache.get(b), '');
	    assert.notOk(playerScriptCache.has(c));
	    playerScriptCache.store(c);
	    assert.ok(playerScriptCache.has(c));
	    assert.strictEqual(playerScriptCache.get(c), 'https://players.brightcove.net/0/1_2/index.min.js');
	  });
	  QUnit.test('clear', function (assert) {
	    var a = {
	      playerId: '1',
	      embedId: '2'
	    };
	    var b = {
	      accountId: '0',
	      playerId: '1',
	      embedId: '2'
	    };
	    playerScriptCache.store(a);
	    playerScriptCache.store(b);
	    playerScriptCache.clear();
	    assert.notOk(playerScriptCache.has(a));
	    assert.notOk(playerScriptCache.has(b));
	  });
	  QUnit.test('forEach', function (assert) {
	    var a = {
	      playerId: '1',
	      embedId: '2'
	    };
	    var b = {
	      accountId: '0',
	      playerId: '1',
	      embedId: '2'
	    };
	    var iterations = [];
	    playerScriptCache.store(a);
	    playerScriptCache.store(b);
	    playerScriptCache.forEach(function (value, key) {
	      iterations.push([value, key]);
	    });
	    assert.deepEqual(iterations, [['', '*_1_2'], ['https://players.brightcove.net/0/1_2/index.min.js', '0_1_2']]);
	  });
	});

	QUnit.module('urls');
	QUnit.test('getUrl for in-page embed', function (assert) {
	  var url = urls.getUrl({
	    accountId: '1',
	    playerId: '2',
	    embedId: '3'
	  });
	  assert.strictEqual(url, 'https://players.brightcove.net/1/2_3/index.min.js', 'the URL is correct');
	});
	QUnit.test('getUrl for iframe embed', function (assert) {
	  var url = urls.getUrl({
	    accountId: '1',
	    playerId: '2',
	    embedId: '3',
	    embedType: 'iframe'
	  });
	  assert.strictEqual(url, 'https://players.brightcove.net/1/2_3/index.html', 'the URL is correct');
	});
	QUnit.test('getUrl for iframe embed supports playlistId, playlistVideoId, and videoId as query parameters', function (assert) {
	  var url = urls.getUrl({
	    accountId: '1',
	    playerId: '2',
	    embedId: '3',
	    embedType: 'iframe',
	    playlistId: 'a',
	    playlistVideoId: 'b',
	    videoId: 'c'
	  });
	  assert.strictEqual(url, 'https://players.brightcove.net/1/2_3/index.html?playlistId=a&playlistVideoId=b&videoId=c', 'the URL is correct');
	});
	QUnit.test('getUrl for in-page embed DOES NOT support playlistId, playlistVideoId, and videoId as query parameters', function (assert) {
	  var url = urls.getUrl({
	    accountId: '1',
	    playerId: '2',
	    embedId: '3',
	    playlistId: 'a',
	    playlistVideoId: 'b',
	    videoId: 'c'
	  });
	  assert.strictEqual(url, 'https://players.brightcove.net/1/2_3/index.min.js', 'the URL is correct');
	});
	QUnit.test('getUrl encodes all possible URL components', function (assert) {
	  var url = urls.getUrl({
	    accountId: ';',
	    playerId: ',',
	    embedId: '/',
	    embedType: 'iframe',
	    playlistId: '?',
	    playlistVideoId: ':',
	    videoId: '@'
	  });
	  assert.strictEqual(url, 'https://players.brightcove.net/%3B/%2C_%2F/index.html?playlistId=%3F&playlistVideoId=%3A&videoId=%40', 'the URL is correct');
	});
	QUnit.test('getUrl uses playerUrl if it exists', function (assert) {
	  var url = urls.getUrl({
	    playerUrl: 'something!'
	  });
	  assert.strictEqual(url, 'something!', 'the URL is correct');
	});

}(QUnit));
