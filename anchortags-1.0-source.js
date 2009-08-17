/*
  jQuery.fn.anchorTags

  Runs through all the links in a webpage an adds class tags
  to links notifying on their role.

  * Semi-Resestant to re-running
  * Optionally takes an array of (local) domains (parameter1) / regular expressions allowed

  FIXME:
   * Consider using linkElm.hostname, linkelm.port, linkElm.protocol, etc. to make checks faster.
     * Seems to be very well supported except (at least) Opera reports linkElm.hostname as 'localhost' when other browsers report ''

*/

(function($){

  var _freg,
      location = document.location,
      hostname = location.hostname,
      port = location.port;

  var anchorTags = $.fn.anchorTags = function (config) {
      var links = this,
          i = this.length;
      if (i)
      {
        var cfg = $.extend({ patterns:{} }, anchorTags.config),
            localDomains = config.localDomains,
            _locreg,
            patterns = config.patterns;

        delete config.patterns;
        $.extend(cfg, config);
        $.extend(cfg.patterns, anchorTags.patterns, patterns);
        config.patterns = patterns;
        localDomains = (localDomains.charAt ? localDomains.split(/\s*,\s*/) : localDomains).concat(cfg.baseDomains);

        _freg = _freg || new RegExp( "^("+location.href.replace(/^https?:/, 'https?:').split('#')[0]+")?#.", 'i' ); // fragments or this
        _locreg = new RegExp( '^([a-z]{3,12}):\/\/('+ localDomains.join('|').replace( /\./g,'\.' ).replace( /\\\\\./g, '.' ) + ')(/|$)', 'i' );
        while (i--)
        {
          var linkElm = links[i],
              link = $(linkElm),
              _href = linkElm.href,
              _isExternal = 0;

          if (linkElm.protocol == 'mailto:') // mailto links
          {
            link.addClass(cfg.emailClass);
          }
          else
          {
            if (/^[a-z]{3,12}:\/\//i.test(_href)) // has protocol?
            {
              var _isHttps = linkElm.protocol == 'https:';
                  _isHttp = linkElm.protocol == 'http:';
              if (_isHttp || _isHttps)
              {
                // secure http protocol
                if (_isHttps)
                {
                  link.addClass(cfg.secureClass);
                }
                // external links
                if ( !_locreg.test(_href))
                {
                  link.addClass(cfg.externalClass);
                  _isExternal = 1;
                }
              }
              // different protocol == external link.
              // (except assume that when both protocols are equal they're "file:" and page is being developed locally)
              else if ( location.protocol != linkElm.protocol ) 
              {
                link.addClass(cfg.externalClass);
                _isExternal = 1;
              }
            }
            // internal/same-page fragment links
            if (!_isExternal && _freg.test(_href))
            {
              link.addClass(cfg.internalClass);
            }

            for (var k in cfg.patterns)
            {
              var _extRegexp = cfg.patterns[k],
                  _classNameFunc;
              if (_extRegexp.splice) // is array
              {
                _extRegexp = _extRegexp[0];
                _classNameFunc = _extRegexp[1];
              }
              if (_extRegexp && _extRegexp.test(_href))
              {
                link.addClass( _classNameFunc ? _classNameFunc(linkElm, _extRegexp, k) : k );
              }
            }

          }

        } // end while

        return this;
      }
    };

  anchorTags.config = {
      baseDomains:   hostname ? [hostname+(port? ':'+port: '')] : [],
    /*
      patterns:      {
          className: /\.(foo|bar|baz)(#|$|\?)/i,
          blah:      [ /\.(foo|bar|baz)(#|$|\?)/i, function(linkElm, regexp, key){ jQuery(linkElm).addClass( 'file_' + regexp.match(linkElm.href)[2] ); }]
        }
    */
      localDomains:  [  // Array or Comma-delimeted string. Regular-expression patterns allowd (except with '.' escaping inverted)
          //'foo.bar.com',
          //'(www\\d?.)?domain.com'  // Matches: domain.com, www.domain.com, www2.domain.com, www.domain3.com, etc.
        ],
      emailClass:    'mailto',
      externalClass: 'external',
      internalClass: 'withinpage',
      secureClass:   'secure'
    };

  anchorTags.patterns = {
      file_image: /\.(jpe?g|png|gif)($|#|\?)/i,
      file_audio: /\.(mp3|ogg|wav)($|#|\?)/i,
      file_video: /\.(m(ov|pg)|avi|wmv)($|#|\?)/i,
      file_pdf:   /\.(pdf)($|#|\?)/i,
      file_doc:   /\.(docx?|rtf|wri)(#|$|\?)/i
    };


})(jQuery);
