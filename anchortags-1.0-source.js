/*
  jQuery.fn.anchorTags

  Runs through all the links in a webpage an adds class tags
  to links notifying on their role.

  FIXME:
   * Consider using linkElm.hostname, linkelm.port, linkElm.protocol, etc. to make checks faster.
     * Seems to be well supported except 
        * Opera (at least) reports linkElm.hostname as 'localhost' when other browsers report ''
        * IE (6-8 at least) report linkElm.port on *all* urls with protocol set (i.e. http://www.foo.com/ has port==':80').

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
            if (linkElm.protocol) // has protocol?
            {
              var _isHttps = linkElm.protocol == 'https:';
                  _isHttp = linkElm.protocol == 'http:';
              // secure http protocol
              if (_isHttps)
              {
                link.addClass(cfg.secureClass);
              }
              if (cfg.externalClass  &&  (
                  // is http(s) and doesn't match the defined localDomains
                  ((_isHttp || _isHttps) && !_locreg.test(_href))  ||
                  // non http(s) protocol == external link. (Except we assume that when both protocols are equal they're "file:" and page is being developed locally)
                  (!_isHttp && !_isHttps  &&  location.protocol != linkElm.protocol )
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
