// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.query v 1.0
// ----------------------------------------------------------------------------------
// Copyright 2011
//   Hugsmiðjan ehf. (http://www.hugsmidjan.is) &
//   Már Örlygsson  (http://mar.anomy.net/)
//
// Dual licensed under a MIT licence (http://en.wikipedia.org/wiki/MIT_License)
// and GPL 2.0 or above (http://www.gnu.org/licenses/old-licenses/gpl-2.0.html).
// ----------------------------------------------------------------------------------
//
// Source & more info:
//   * http://github.com/maranomynet/jqueryquery/
//
//
// jQuery.fn.query() emulates the behavior of .querySelectorAll() 
// by allowing a full/complex selector to be matched against
// a small slice of the dom.
//
// It essentially does: return collection.find('*').andSelf().filter( selector )
// except in a couple of orders of magnitude more efficient way.

jQuery.fn.query = function ( selector ) {
    var $ = jQuery,
        scopeElms = this,
        scopeIsDoc = scopeElms.length === 1  &&  scopeElms.is(document),
        // check for obviously simple selectors.... (needs more elegance)
        isComplexSelector = /\s/.test( selector.replace(/\s*([|~*$\^!]?=|,)\s*/g, '$1') ),
        elms;

    if ( scopeIsDoc  ||  isComplexSelector )
    {
      elms = $(selector);
      if ( scopeElms[0] )
      {
        elms = elms.filter(function(){
            var i = scopeElms.length;
            while (i--) {
              if ( scopeElms[i] === this || $.contains(scopeElms[i], this) )
              {
                return true;
              }
            }
            return false;
          });
      }
    }
    else
    {
      elms =  scopeElms.filter( selector )
                  .add( scopeElms.find(selector) );
    }
    return $(elms);
  };

