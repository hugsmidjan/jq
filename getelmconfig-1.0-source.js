// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.getElmConfig v 1.0
// ----------------------------------------------------------------------------------
// (c) 2010 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------
//
(function($){

  // Resolves and compiles the appropriate config object for an element
  // - based on a list of selectors that it matches -
  // and optionally (for links or form elements) match it against a list of HREF URLs.
  // Config objects are sorted by their (optional) `$priority` value (integer).
  // Usage patterns:
  //    _getElmConfig( DomElement, selectorBasedCfgObjectList, urlBasedCfgObjectList);
  //    _getElmConfig( DomElement, UrlString, selectorBasedCfgObjectList, urlBasedCfgObjectList);
  //    _getElmConfig( UrlString, selectorBasedCfgObjectList, urlBasedCfgObjectList);
  // returns a compiled/merged config Object, or `undefined` if no config objects are found.
  $.getElmConfig = function (elm, url, selectorList, urlList) {

      var configs = []; // an Array to hold all the settings objects that we might come across
      // handle the case where optional `url` parameter was skipped
      if ( url  &&  typeof url != 'string' )
      {
        urlList = selectorList;
        selectorList = url;
        url = undefined;
      }
      // handle the case where the `elm` parameter was skipped - and only `url` was provided.
      if (typeof elm == 'string')
      {
        url = elm;
        elm = undefined;
      }
      if ( elm  && !url )
      {
        url = elm.attr('href') || elm.attr('action');
      }

      if ( elm  &&  selectorList )
      {

        $.each(selectorList, function (selectorKey, cfg) {
            if ( elm.is(selectorKey) )
            {
              cfg.$priority = cfg.$priority || 0;  // enforce priority for sort comparison below
              configs.push(cfg);
            }
          });
        // sort the configs by (ascending) priority (highest $priority last), because of the way `jQuery.extend()` merges.
        configs.sort(function(a,b){ return a.$priority - b.$priority; });
      }

      if ( url  &&  urlList )
      {
        // look up and append a `urlList` rule-set.
        // ...the lookup is quite liberal - making http(s) protocols, local domain-name, and #fragments optional
        var urlCfg = urlList[ url ],
            url2,
            url3;
        if (!urlCfg)
        {
          // try again - this time stripping the protocol off the URL
          url2 = url.replace(/^https?:\/\//, '//');
          urlCfg = urlList[ url2 ];
        }
        if (!urlCfg)
        {
          // try again - normalizing local URLs
          url3 = _normalizeLocalUrl(url);
          urlCfg = urlList[ url3 ];
        }
        // try again one final time - this time removing # fragments off the URLs
        if ( !urlCfg && url.indexOf('#')>-1 )
        {
          urlCfg =  urlList[ url.split('#')[0] ]  ||
                    ( url2!=url  &&  urlList[ url2.split('#')[0] ] )  ||
                    ( url3!=url  &&  urlList[ url3.split('#')[0] ] )
                  ;
        }
        // `.push` because URL-based settings should have the highest priority.
        urlCfg  &&  configs.push(urlCfg);
      }
      if (configs.length)  // because an "empty" configs Array always contains [true, {}].
      {
        // insert a "deep" boolean flag at the front, and the empty "target" object to extend;
        configs.unshift( true, {} );
        // feed `configs` as an arguments list into jQuery.extend() to produce a nicely reduced union of "configuration" settings.
        var config = $.extend.apply($, configs);
        return config;
      }

    };


      // detects true "local" URLs and in those cases returns nice server-root relative URLs (with the protocol and hostname prefix chopped-off).
      // For a page with the URL "http://foo.com:8080/", the following URLs are all considered "local"
      // and will return the following relative urls:
      //   * "https://foo.com:8080/foo"           -->  "/foo"
      //   * "http://foo.com:8080/index.html"     -->  "/index"
      //   * "//foo.com:8080/"                    -->  "/"
      //   * "https://www.foo.com:8080"           -->  "/"
      //   * "http://www.foo.com:8080/bar.jsp"    -->  "/bar.jsp"
      //   * "//www.foo.com:8080/baz/"            -->  "/baz/"
  var _normalizeLocalUrl = function (url) {
          // if no `url` is supplied - then default to the current document URL.
          return (url||window.location.href).replace(_protocolPlusLocalDomain, '/');
        },


      // pattern that matches the local domain.
      _protocolPlusLocalDomain = new RegExp('^(https?:)?//(www\\.)?'+ window.location.host.replace(/\./g, '\\.') +'/?');


})(jQuery);