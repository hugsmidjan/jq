/* $.fn.anchorTags 1.0  -- (c) 2009-2013 Hugsmiðjan ehf. @preserve*/
// ----------------------------------------------------------------------------------
// jQuery.fn.anchorTags v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009-2013 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
//   * Valur Sverrisson
//   * Borgar Þorsteinsson  -- http://borgar.undraland.com
// ----------------------------------------------------------------------------------

/*
  Runs through all the links in a webpage an adds class tags
  to links notifying on their role.

 ---------------------------------------------------------------------------
  NOTE TO THE FUTURE:
  We considered the extensive use of linkElm.host, linkElm.hostname,
  linkelm.port, linkElm.protocol, etc. to make checks faster.
  We then ran into the following problems:
    * Opera (at least) reports linkElm.hostname as 'localhost' when
      other browsers report ''
    * IE (6-8 at least) report linkElm.port on *all* urls with protocol
      set (i.e. http://www.foo.com/ has port==':80').
 ---------------------------------------------------------------------------

*/

(function($){

  var _fragmReg,
      location = document.location,
      hostname = location.hostname,
      port = location.port;

  var anchorTags = $.fn.anchorTags = function (config) {
      config = config || {};
      var globalCfg = window.anchorTags_config;
      var links = this.filter('[href]');
      var tagged = [];

      if (links[0])
      {
        var cfg = $.extend(true,
                      { patterns:{} },
                      { patterns:anchorTags.patterns },
                      anchorTags.config,
                      globalCfg
                    );
        var localDomains = config.localDomains;
        delete config.localDomains;
        var patterns = config.patterns;
        delete config.patterns; // move `config.patterns` out of the way before extending `cfg`

        $.extend(cfg, config);

        if (cfg.usePatterns)
        {
          var filteredPatterns = {};
          // pull in the user-specified patterns only
          $.each(cfg.usePatterns, function(i, name){
              cfg.patterns[name] && (filteredPatterns[name] = cfg.patterns[name]);
            });
          cfg.patterns = filteredPatterns;
        }

        if ( patterns )
        {
          $.extend(cfg.patterns, patterns);
          config.patterns = patterns; // tidy up
        }
        if ( localDomains )
        {
          config.localDomains = localDomains;
        }

        links = cfg.skipFilter ? links.not(cfg.skipFilter) : links;

        localDomains = (cfg.baseDomains||[])
                          .concat( cfg.localDomains||[], localDomains||[] )
                              .join('|')
                              .replace( /\./g, '\\.' )
                              .replace( /\\\\\./g, '.' );

        var _locreg = new RegExp( '^(?:[a-z]{3,12})://(?:'+localDomains+')(?:/|$)', 'i');

        links.each(function () {
            var linkElm = this,
                link = $(linkElm),
                _href = linkElm.href,
                _protocol = linkElm.protocol,
                isTagged=0,
                is = { a:{} };

            is.type = is.a; // alias is.a.vido as is.type.video

            // There's this weirdo bug in MSIE 8-10 where some (otherwise normal) link elements
            // don't report a protocol... sometimes... ack!
            // This happens only once in a blue moon - but in those cases it's very consitent
            if (_protocol === ':')
            {
              linkElm.href += '';
              _protocol = linkElm.protocol;
            }

            if (_protocol === 'mailto:') // mailto links
            {
              link.addClass(cfg.emailClass);
              is.mailto = !0;
              ++isTagged;
            }
            else if (_protocol === 'tel:' || _protocol === 'callto:') {  // tel links
              link.addClass(cfg.telClass);
              is.tel = !0;
              ++isTagged;
            }
            else
            {
              // javascript: and data: urls are not tagged as either internal or external.
              // They're really in a category of their own...
              if (!/^(javascript|data):/.test(_protocol))
              {
                if (_protocol) // has protocol?
                {
                  var _isHttps = _protocol === 'https:',
                      _isHttp  = _protocol === 'http:';

                  // secure http protocol
                  if (_isHttps)
                  {
                    link.addClass(cfg.secureClass);
                    is.secure = !0;
                    ++isTagged;
                  }
                  if (cfg.externalClass  &&  (
                      // is http(s) and doesn't match the defined localDomains
                      ((_isHttp || _isHttps) && !_locreg.test(_href))  ||
                      // non http(s) protocol === external link. (Except we assume that when both protocols are equal they're "file:" and page is being developed locally)
                      (!_isHttp && !_isHttps  &&  location.protocol !== _protocol )
                     ))
                  {
                    link.addClass(cfg.externalClass);
                    is.external = !0;
                    ++isTagged;
                  }
                }
                // internal/same-page fragment links
                if (!is.external && cfg.internalClass)
                {
                  _fragmReg = _fragmReg || new RegExp( '^(?:'+location.toString().replace(/^https\\?:/, 'https?:').split('#')[0].replace(/([\\\^\$*+\[\]?{}.=!:(|)])/g, '\\$1')+')?#.', 'i' );
                  if ( _fragmReg.test(_href) )
                  {
                    link.addClass(cfg.internalClass);
                    is.internal = !0;
                    ++isTagged;
                  }
                }
              }

              for (var key in cfg.patterns)
              {
                var _patternObj = cfg.patterns[key] || {},
                    _check = _patternObj.check || _patternObj,
                    _className = $.isFunction(_check) ? _check(linkElm, key) : null;

                if (_className || _check.test(_href) )
                {
                  link.addClass( _className  ||  _patternObj.tag  ||  (cfg.patternClassPrefix + key) );
                  (is.pattern || (is.pattern=[])).push( key );
                  is.a[key] = !0;
                  ++isTagged;
                }
              }

            }

            if ( isTagged )
            {
              tagged.push( link[0] );
              cfg.onTag  &&  cfg.onTag.call( cfg, link, is );
            }
          }); // END .each()

      }
      this.taggedAnchors = $(tagged);
      return this;
    };


  anchorTags.config = {
      baseDomains:   hostname ? [hostname+(port? ':'+port: '')] : [],
      //usePatterns: ['pdf', 'doc', 'xsl'],  // list of keys to use from `$.fn.anchorTags.patterns`
                                             // `null`/`undefined` defaults to using all patterns.
    /*
      patterns:      {
        // shorthand:
          'classSuffix': myRegExp,
          'classSuffix': function(linkElm,key){ return true; },
          foo:           function(linkElm,key){ return 'myClassName'; },
        // full syntax
          'classSuffix': { check: myRegExp                                                           },
          foo:           { check: myRegExp,                                       tag: 'myClassName' },
          foo:           { check: function(linkElm,key){ return 'myClassName'; }                     },
          foo:           { check: function(linkElm,key){ return true; },          tag: 'myClassName' }
        },
    */
      localDomains:  [  // Regular-expression patterns allowd (except with '.' escaping inverted)
          //'foo.bar.com',
          //'(www\\d?.)?domain.com'  // Matches: domain.com, www.domain.com, www2.domain.com, www.domain3.com, etc.
        ],
      // onTag: function ( $link, is ) {
      //     var cfg = this;
      //     if ( is.external || is.mailto || is.tel || is.pattern || is.pattern[0] || is.a.image || is.a.video || is.secure || is.internal ||  )
      //     {
      //       $link.addClass('foobar');
      //     }
      //   },
      skipFilter:    '.no-anchortags', // function(i, link){ return $(link).is('.no-anchortags'); },

      emailClass:    'mailto',
      telClass:      'tel',
      externalClass: 'external',
      internalClass: 'withinpage',
      patternClassPrefix: 'file_',
      secureClass:   'secure'
    };


  anchorTags.patterns = {
      image: { check: /\.(jpe?g|png|gif)($|#|\?)/i },
      audio: { check: /\.(mp3|wav|aac|wma|flac|ogg)($|#|\?)/i },
      video: { check: /\.(m(ov|pe?g|p4)|avi|wmv)($|#|\?)/i },
      pdf:   { check: /\.(pdf)($|#|\?)/i },
      doc:   { check: /\.(docx?|rtf|wri|odt|sxw)(#|$|\?)/i },
      xls:   { check: /\.(xlsx?|csv|ods|sxc)(#|$|\?)/i },
      pack:  { check: /\.(zip|rar|7z|gz)(#|$|\?)/i }
    };


})(window.jQuery);
