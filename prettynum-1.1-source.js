// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.prettyNum v 1.1
// ----------------------------------------------------------------------------------
// (c) 2010 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

(function($){

  var _tokens = {},
      _getTokens = function (lang) {
          // FIXME:
          //  * Add more elegant handling of locale strings http://tools.ietf.org/html/rfc4646
          //    ...i.e. add support for 3 and 4 letter language subtags
          //  * Cache/optimize the retrieval of language codes for HTML Elements...
          lang = (typeof lang == 'string' ?  lang : $(lang||'body').closest('[lang]').attr('lang')||'').toLowerCase().substr(0,2) || 'en';
          var t = _tokens[lang];
          if (!t)
          {
            var orgLang = lang;
            while (lang.length > 2  &&  (lang = lang.substr(0,2)) ) // default "lang+region" codes (en-us) to simple "lang" codes (en)
            {
              if (_tokens[lang])
              {
                break;
              }
            }
            t = _tokens[orgLang] = _tokens[lang] || _tokens.en;  // default to English 1,234.56 style.
          }
          // create regular expression to match all fractionSeparators 
          t[2] = t[2] || new RegExp(t[0].replace('.', '\\.'), 'g');
          // create expression to match \d\d\d
          t[3] = t[3] || new RegExp('^([^'+ t[0]+t[1] +']*)(\\d{3}(['+ t[0]+t[1] +']|$))');

          return t;
        };


  // Build the language-token map. ("lang+region" codes (`fr-ca`) default to simple "lang" codes (`fr`))
  // FIXME:
  //  * Add more locales.
  $.each([
      ['en,es-do,es-gt,es-hn,es-mx,es-ni,es-pa,es-pe,es-sv,es-us', ',.'],
      ['de,dk,es,is,fr-be,it', '.,'],
      ['fi,fr,no,se', ' ,'],
      ['de-ch,de-li,fr-ch,it-ch', "'."]
    ], function(i, tokenArr){
      var tok = tokenArr[1].split(''),
          langs = tokenArr[0].split(','),
          i = langs.length;
      while (i--) {  _tokens[langs[i]] = tok;  }
    });


  $.prettyNum = {

      tokens: _tokens, // { 'is':['.',','], 'en':[',','.']  }
    
    /*
      Returns a prettified numerical string
      Usage:
        $.prettyNum.make( (Number|String|Element)Value, (String|Element)Lang, ?(Boolean)trail );
        $.prettyNum.make( (Number|String|Element)Value, ?(Boolean)trail );
        $.prettyNum.make( (Number|String|Element)Value, (String|Element)Lang, ?(Object)config );
        $.prettyNum.make( (Number|String|Element)Value, ?(Object)config );

      Default config = {
          trail:     false,  // Defaults to stripping trailing fractionSeparators (i.e. '123.' -> '123').
          decimals:  null,   // specify number of decimals to enforce
          milliSep:  true,   // false == don't insert thousandSeperators
          lang:      null    // defaults to either `lang` parameter (or `value` element)
        }
    */
      make: function( val, lang, trail ) {
          var cfg;
          if ( arguments.length<3 )
          {
            if ( typeof lang == 'boolean' )
            {
              trail = lang;
              lang = null;
            }
            else if ( $.isPlainObject(lang) ) 
            {
              cfg = lang;
              lang = null;
            }
          }
          else if ( $.isPlainObject(trail) )
          {
            cfg = trail;
          }
          trail = cfg ? cfg.trail : trail;
          cfg = $.extend({
                      milleSep:true
                    }, cfg);
          lang = lang || cfg.lang;
          if (val.jquery || val.nodeName)
          {
            var elm = $(val);
            val = elm.val() || elm.text();
            lang = lang || elm;
          }
          var tok = _getTokens(lang);
          // normalize field.value
          val = (typeof val == 'number') ? 
                   val+'':
                   $.trim(val+'')
                      .replace(/  */g, ' ')                   // collapse multiple spaces
                      .replace(tok[2], '')                    // remove thousandSeparators
                      .replace(tok[1], '!!')                  // temporarily convert fractionSeparator to '!!'
                      .replace(/\./g, '')                     // remove extraneous dots (.)
                      .replace(/!!/g, '.')                    // convert '!!' back to fractionSeparator
                      .replace(/^(-)?\./, '$10.')             // prepend a leading fractionSeparator with '0'
                      .replace(/(.)-/g, '$1')                 // strip out extraneous '-' (negation) symbols
                      .replace(/[^\d-.]/g, '')                // remove rubbish characters
                      .replace(/^(-?\d*)(\.\d*)?.*$/, '$1$2') // remove extraneous fractionSeparators and digits
                    ;
          if (val)
          {
            // Default to stripping trailing fractionSeparators (i.e. '123.' -> '123').
            // The option of keeping them is especially useful when prettifying numbers `onKeyup`
            var decimals = cfg.decimals;
            if ( decimals >= 0 )
            {
              var factor =  Math.pow( 10, decimals );
              val = ''+ Math.round( parseFloat(val) * factor );
              // string operation instead of simple division by `factor`
              // to avoid the occational javascript floating point rounding errors
              // that may occur.
              if ( decimals )
              {
                var needed = 1 + decimals - val.length;
                if ( needed > 0 )
                {
                  val = (new Array(needed+1)).join('0') + val;
                }
                val = val.substr( 0, val.length-decimals ) + '.' + val.substr( val.length-decimals );
              }
            }
            else if (!trail)
            {
              val = val.replace(/\.$/, '');
            }
            val = val.replace('.', tok[1]); // reinsert fractionSeparator
            if ( cfg.milleSep )
            {
              // insert thousandSeparators
              while ( tok[3].test(val) )
              {
                val = val.replace(tok[3], '$1'+tok[0]+'$2');
              }
            }
            val = val.replace(/^(-)?[^\d-]/, '$1');   // remove leading thousandSeparator
          }
          return val;
        },

    /*
      Parses a prettified numerical string and returns a plain Number
      Usage:
        $.prettyNum.read( [Number|String|Element], [String|Element] );
        $.prettyNum.read( [Number|String|Element] );
    */
      read: function( val, lang ){
          if (val.jquery || val.nodeName)
          {
            var elm = $(val);
            val = elm.val() || elm.text();
            lang = lang || elm;
          }
          var tok = _getTokens(lang);
          val = parseFloat(
                    $.prettyNum.make(val, lang)
                        .replace(tok[2], '')
                        .replace(tok[1], '.')
                  );
          return isNaN(val) ? null : val;
        }
    };


})(jQuery);