// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.anchorTags v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
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

  var _freg,
      location = document.location,
      hostname = location.hostname,
      port = location.port;

  var anchorTags = $.fn.anchorTags = function (config) {
      config = config || {};
      var links = this.filter('[href]'),
          i = links.length;
      if (i)
      {
        var cfg = $.extend({ patterns:{} }, anchorTags.config),
            localDomains = config.localDomains||[],
            _locreg,
            patterns = config.patterns,
            defaultPatterns = anchorTags.patterns;

        delete config.patterns;
        $.extend(cfg, config);
        if (cfg.usePatterns)
        {
          // pull in the user-specified patterns only
          $.each(cfg.usePatterns, function(i, name){
              defaultPatterns[name] && (cfg.patterns[name] = defaultPatterns[name]);
            });
        }
        else
        {
          // use all default patterns.
          $.extend(cfg.patterns, defaultPatterns);
        }
        $.extend(cfg.patterns, patterns);
        config.patterns = patterns;
        localDomains = localDomains.concat(cfg.baseDomains);

        _locreg = new RegExp( '^([a-z]{3,12}):\/\/('+ localDomains.join('|').replace( /\./g,'\.' ).replace( /\\\./g, '.' ) + ')(/|$)', 'i' );
        while (i--)
        {
          var linkElm = links[i],
              link = $(linkElm),
              _href = linkElm.href,
              _isExternal = 0,
              _protocol = linkElm.protocol;


          if (_protocol == 'mailto:') // mailto links
          {
            link.addClass(cfg.emailClass);
          }
          else
          {
            if (!/^(javascript|data):/.test(_protocol)) // javascript: and data: urls are not tagged as either internal or external. Essentially they're in a category of their own...
            {
              if (_protocol) // has protocol?
              {
                var _isHttps = _protocol == 'https:',
                    _isHttp  = _protocol == 'http:';

                // secure http protocol
                if (_isHttps)
                {
                  link.addClass(cfg.secureClass);
                }
                if (cfg.externalClass  &&  (
                    // is http(s) and doesn't match the defined localDomains
                    ((_isHttp || _isHttps) && !_locreg.test(_href))  ||
                    // non http(s) protocol == external link. (Except we assume that when both protocols are equal they're "file:" and page is being developed locally)
                    (!_isHttp && !_isHttps  &&  location.protocol != _protocol )
                   ))
                {
                  link.addClass(cfg.externalClass);
                  _isExternal = 1;
                }
              }
              // internal/same-page fragment links
              if (!_isExternal && cfg.internalClass)
              {
                _freg = _freg || new RegExp( "^("+location.toString().replace(/^https?:/, 'https?:').split('#')[0].replace( /\./g,'\.' )+")?#.", 'i' );
                _freg.test(_href)  &&  link.addClass(cfg.internalClass);
              }
            }

            for (var key in cfg.patterns)
            {
              var _patternObj = cfg.patterns[key] || {},
                  _check = _patternObj.check || _patternObj,
                  _className = $.isFunction(_check) ? _check(linkElm, key) : null;

              if (_className || _check.test(_href))
              {
                link.addClass( _patternObj.tag  ||  (_className && _className.charAt && _className)  ||  cfg.patternClassPrefix + key );
              }
            }

          }

        } // end while

      }
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
      emailClass:    'mailto',
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
      xls:   { check: /\.(xlsx?|csv|ods|sxc)(#|$|\?)/i }
    };


})(jQuery);
