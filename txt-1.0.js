// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.txt() v 1.0
// ----------------------------------------------------------------------------------
// (c) 2011 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------
//
// TODO: add method for spawning prototypally inhereted instances of $.txt for scoping of translation keys.
//
(function($){

  var 
      // private storage for translated strings.
      // ...extended via $.txt.add()
      i18n = {
          is: {
              localeCode: 'is_IS'
            },
          en: {
              localeCode: 'en_US'
            }
        },

      _langStack = [ $('html').attr('lang') || 'en' ], // get the document's lang="" attribute - defaulting to english.

      isPlural = function ( n ) {  return n != 1;  };


  // $.txt() is the main translation method.
  // Accepts translation `key`, and an optional `lang` attribute - which may be either a language code (String), or a DOM node whose language will be resolved via standard ancestry traversal.
  // This method is fairly simple and stupid, and will not attempt any fancy dialect handling (i.e. "en-uk") or such. All language codes are brutally truncated at two characters.
  // Returns a translated string if possible, with fall-back to english translation, and ultimately to returning the translation key itself.
  $.txt = function ( key, lang ) {
      return i18n[ getLang(lang) ][ key ]  ||  i18n.en[ key ]  ||  key;
    };


  $.extend($.txt,  {

      // localize a string based on plurality of a given number
      // example: $.txt.nget( 'singularKey', 'pluralKey', numResults, element||'de' )
      n: function ( sKey, plKey, num, lang ) {
        var txtObj = i18n[ getLang( lang ) ] || i18n.en,
            plFunc = txtObj.isPlural || isPlural,
            plCode = plFunc( num ),
            // for weirdo languages with more than one form of plurality,
            // the isPlural function can return an arbitrary value that evaluates higher than (true|false|1|0) 
            // and in that case the return value gets appended to the plKey with a '-'.
            plSuffix = plCode>1 ? '-'+plCode : '';
        return $.txt( arguments[ plCode?1:0 ]+plSuffix, lang );
      },


      // accepts text (language code) or DOM element.
      // returns the first two characters of the text supplied
      // ...or the resolved lang="" value of the element
      // ...or the top value of the _langStack.
      getLang: function ( lang ) {
          if ( lang )
          {
            if ( typeof lang !== 'string' )
            {
              lang =  ( (lang.closest ? lang : $(lang)).closest('[lang]').attr('lang') || '' )
                          .substr(0,2);
            }
            else if ( lang.length > 2 )
            {
              lang = lang.substr(0,2);
            }
          }
          return lang || _langStack[0];
        },

      // Use $.txt.add() to add translation keys to the private `i18n` object.
      // Example: $.txt.add({  en:{ girl:'Girl' },  is:{ girl:'Stúlka' },  se:{ girl:'Flicka' }  });
      add: function (obj) {
          $.extend(true, i18n, obj);
        },


      // Use $.txt.setLang() to push a new language (temporarily) onto the language stack.
      setLang: function ( lang ) {
          _langStack.unshift( getLang(lang) );
        },

      // Use $.txt.unsetLang() to remove the last language pushed into the stack (but never empties the language stack)
      unsetLang: function () {
          if (_langStack[1]) { _langStack.shift(); }
        },


      setDefaultLang: function ( lang ) {
          _langStack[ _langStack.length-1 ] = getLang(lang);
        }

    });

  var getLang = $.txt.getLang; // internal shorthand alias.

}(jQuery));
