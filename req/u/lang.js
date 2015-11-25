// Finds and returns the language of an element - caching the results on the element itself.
//
// Usage:
// jQuery.lang();          // returns the document language.
// jQuery.lang(true);      // returns full document language code. e.g. "en-uk"
// jQuery.lang(elm);       // returns the language of elm.
// jQuery.lang(elm, true); // returns full language code of elm. e.g. "en-uk"
// jQuery.lang( jQuery(elm) ); // returns the language of the *first* element in the jquery object/array.
//
var $ = window.jQuery;

$.lang = function (elm, returnFull) {
  if ( typeof elm === 'boolean' ) {
    returnFull = elm;
    elm = null;
  }
  var lang = $(elm||'html').closest('[lang]').attr('lang') || '';
  return lang ?
      (!returnFull ? lang.substr(0,2) : lang).toLowerCase():
      null;
};

// returns the lang="" value of the first item in the collection
$.fn.lang = function (returnFull) {
  return $.lang(this[0], returnFull);
};
