/* jQuery extra utilities 1.3  -- (c) 2010-2015 Hugsmiðjan ehf.  @preserve */
// ----------------------------------------------------------------------------------
// Miscellaneous jQuery utilities collection v 1.3
// ----------------------------------------------------------------------------------
// (c) 2010-2014 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

(function(module,$){
// reloadPage()
module.exports = function (url) {
    var _docLoc = document.location;
    var _docHref = _docLoc.href;
    url = url || _docHref;
    // juggling ?/& suffixes is neccessary to 100% guarantee a reload.
    if ( url === _docHref )
    {
      var blah =  !/\?/.test(url) ?
                      '?':
                  !/[&?](?:#|$)/.test(url) ?
                      '&':
                      '';
      url = url.replace(/[&?]?(#.*)?$/, blah+'$1');
    }
    _docLoc.replace( url );
  };
$.reloadPage = module.exports;



// ==========================================================================================================




// Prototypal inheritance
var F = function(){};

// beget
module.exports = function (proto, props) {
    F.prototype = proto;
    var o = new F();
    if ( props )
    {
      for (var key in props)
      {
        if ( !props.hasOwnProperty(key) )
        {
          o[key] = props[key];
        }
      }
    }
    return o;
  };
$.beget = module.exports;



// ==========================================================================================================




// coderjoe zero padding for numbers - http://jsperf.com/left-zero-pad/18
module.exports = function (number, width) {
    var num = Math.abs(number);
    var zeros = Math.max(0, width - Math.floor(num).toString().length );
    zeros = Math.pow(10,zeros).toString().substr(1);
    return (number<0?'-':'') + zeros + num;
  };
$.zeroPad = module.exports;



// ==========================================================================================================




// Usage:
//   aquireId();                         // returns a valid unique DOM id string that can be safely assigned to an element.
//   aquireId(prefDefaultIdString);      // returns a valid unique DOM id based on `prefDefaultIdString` (appending/autoincrementing a trailing integer if needed)
//   aquireId(elm);                      // returns the value of elm.id -- automatically assigning a unique id first, if needed.
//   aquireId(elm, prefDefaultIdString); // returns the value of elm.id -- if needed automatically assigning a unique id based on `prefDefaultIdString`.
//

// suffix and prefix used to generate temporary @id-values for HTMLelements without an @id
var _guidPrefix = 'tmp_' + (new Date()).getTime() + '_';
// a counter that should be incremented with each use.
var _guid = 1;

// aquireId
module.exports = function (el, prefDefaultId) { // el is an optional parameter.
        if (typeof el === 'string')
        {
          prefDefaultId = el;
          el = undefined;
        }
        if ( el )
        {
          el = el.nodeType ? el : el[0];
        }
        if (!el || !el.id)
        {
          var id = prefDefaultId  ||  _guidPrefix + _guid++;
          if (prefDefaultId)
          {
            var count;
            while ( document.getElementById(id) )
            {
              if (count === undefined)
              {
                var m = prefDefaultId.match(/\d+$/);
                count = m ? parseInt(m[0],10) : 1;
                prefDefaultId = m ? prefDefaultId.replace(/\d+$/, '') : prefDefaultId;
                m = undefined;
              }
              count++;
              id = prefDefaultId + count;
            }
          }
          if (!el) { return id; }
          if (!el.id) { el.id = id; }
        }
        return el.id;
      };
$.aquireId = module.exports;



// ==========================================================================================================




var div;
var vendors;
var cache = {};

// cssSupport
module.exports = function(prop) {
    if ( !div )
    {
      div = document.createElement('div');
      vendors = 'Khtml Ms O Moz Webkit'.split(' ');
    }
    var ret = prop in cache ?
                  cache[prop]:
                  prop in div.style || undefined;
    if ( ret===undefined )
    {
      var Prop = prop.replace(/^[a-z]/, function(val) {
          return val.toUpperCase();
        });
      var i = vendors.length;
      while (i--)
      {
        if ( vendors[i]+Prop in div.style )
        {
          ret = true;
          break;
        }
      }
    }
    ret = cache[prop] = ret||false;
    return ret;
  };
$.cssSupport = module.exports;



// ==========================================================================================================




// throttleFn()
// returns a throttled function that never runs more than every `delay` milliseconds
// the returned function also has a nice .finish() method.
module.exports = function (func, delay, skipFirst) {
    if ( typeof delay === 'boolean' )
    {
      skipFirst = delay;
      delay = 0;
    }
    delay = delay || 50;
    var throttled = 0;
    var timeout;
    var _args;
    var _this;
    var throttledFn = function () {
            _args = arguments;
            _this = this;
            if ( !throttled )
            {
              skipFirst ?
                  throttled++:
                  func.apply(_this, _args);
              timeout = setTimeout(throttledFn.finish, delay);
            }
            throttled++;
          };
    throttledFn.finish = function () {
        timeout && clearTimeout( timeout );
        throttled>1 && func.apply(_this, _args);
        throttled = 0;
      };
    return throttledFn;
  };
$.throttleFn = module.exports;



// ==========================================================================================================




// debounceFn()
// returns a debounced function that only runs after `delay` milliseconds of quiet-time
// the returned function also has a nice .cancel() method.
module.exports = function (func, delay, immediate) {
    if ( typeof delay === 'boolean' )
    {
      immediate = delay;
      delay = 0;
    }
    delay = delay || 50;
    var timeout;
    var debouncedFn = function () {
            var args = arguments;
            var runNow = !timeout && immediate;
            var _this = this;
            debouncedFn.cancel();
            timeout = setTimeout(function(){
                  !runNow  &&  func.apply(_this, args); // don't re-invoke `func` if runNow is true
                  timeout = 0;
                }, delay);
            runNow  &&  func.apply(_this, args);
         };
    debouncedFn.cancel = function () {
        clearTimeout(timeout);
        timeout = 0;
      };
    return debouncedFn;
  };
$.debounceFn = module.exports;



// ==========================================================================================================




// parseParams( queryString )
//
// Convert queryString type Strings into a neat object
// where each named value is an Array of URL-decoded Strings.
// Defaults to parsing the current document URL if no paramString is passed.
//
// Example:
//    var obj = parseParamS( "?foo=1&=bar&baz=&foo=2&" );
//      ==>  {  'foo':['1','2'],  '':['bar'],  'baz':['']  }
//    var obj = parseParamS( "" );
//      ==>  { }
module.exports = function (paramString) {
    paramString = ( paramString!==undefined ? paramString : document.location.search )
                      .trim()
                      .replace(/^[?&]|&$/g, '');
    var map = {};
    if ( paramString )
    {
      var params = paramString.replace(/\+/g, ' ')
                      .split('&'),
          dCode = decodeURIComponent,
          i = 0,
          l = params.length;
      for (; i<l; i++)
      {
        var pair = params[i].split('='),
            name = dCode(pair[0]);
        ( map[name] = map[name]||[] ).push( dCode(pair[1]||'') );
      }
    }
    return map;
  };
$.parseParams = module.exports;



// ==========================================================================================================




var _reCache = {};

// cropText()
module.exports = function (str, length, end) {
    end = end || ' ...';
    str = str.trim().replace(/\s+/g, ' ');
    if ( length  &&  str.length > length+end.length )
    {
      var hash = length +'~~'+end;
      var re = _reCache[hash] || (_reCache[hash] = new RegExp('^(.{0,'+length+'})\\s.+$'));
      var newTxt = str.replace(re, '$1');
      return newTxt + (newTxt.length<str.length ? end : '');
    }
    return str;
  };
$.cropText = module.exports;



// ==========================================================================================================




// Simple String templating (variable injection) that accepts either arrays or hash-maps.
// Usage:
// var output = inject('Hello %{1}! Hava a %{0}', ['banana', 'John']);                           // Returns  'Hello John! Have a banana'
// var output = inject('Hello %{name}! Hava a %{food}', { food : 'banana', person : 'John' });   // Returns  'Hello John! Have a banana'
//
var _injectRegExpCache = {}; // used by $.inject(); to store regexp objects.

// inject
module.exports = function(_theString, _vars) {
    var _keys = [],
        l = _vars.length,
        i;
    // fail early to save time
    if (_theString.indexOf('%{')>-1)
    {
      // NOTE: this is a fairly ugly way to collect the "keys" depending on if _vars is a List or an Object.
      if (isNaN(l)) { for (i in _vars) { _keys.push(i); } }
      else          { while (l--) { _keys.push(l); } }
      // now loop through the _keys and perform the replacement
      i = _keys.length;
      while (i--)
      {
        var _key = _keys[i],
            re   = _injectRegExpCache[_key] || (_injectRegExpCache[_key] = new RegExp(RegExp.escape('%{'+_key+'}'),'g')); // retieve the corresponding RegExp from the cache.
        _theString = _theString.replace(re, _vars[_key]);
      }
    }
    return _theString;
  };
$.inject = module.exports;



// ==========================================================================================================




// liveVal
// update input/textarea values while maintaining cursor-position *from end*
module.exports = function (input, value) {
    var delta = value.length - input.value.length;
    var selStart = input.selectionStart + delta;
    var selEnd = input.selectionEnd + delta;
    input.value = value;
    input.setSelectionRange  &&  input.setSelectionRange(selStart, selEnd);
  };
$.liveVal = module.exports;



// ==========================================================================================================




// shuffle the contents of an array
module.exports = function (array, immutable) {
    array = immutable ? [].slice.call(array) : array;
    var l = array.length;
    while (l) {
      var p = Math.floor( l * Math.random(l--) );
      var t = array[l];
      array[l] = array[p];
      array[p] = t;
    }
    return array;
  };
$.shuffle = module.exports;



// ==========================================================================================================




// Escape img[src] values in incoming Ajax html result bodies to avoid automatic preloading of all images.
// don't use data-src="" by default - to avoid conflict with data-src="" set on the server-side as a part of deliberate lazyloading, etc.

// image_src
module.exports = {

    suppress: function (html, attr) {
        return html && html.replace( /(<img[^>]*? )src=/gi, '$1'+(attr||'data-srcAttr')+'=' );
      },

    // Reinserts img[src] values escaped by suppress()
    unsuppress: function (dom, attr) {
        if ( dom )
        {
          attr = attr || 'data-srcAttr';
          if ( typeof dom === 'string')
          {
            dom = dom.replace( new RegExp('(<img[^>]*? )'+attr+'=', 'gi') ,'$1src=' );
          }
          else
          {
            var elms = [];
            var domArr = dom.nodeType ? [dom] : [].slice.call(dom);
            domArr.forEach(function(elm){
                if ( elm.nodeName === 'img' && elm.hasAttribute(attr) )
                {
                  elms.push(elm);
                }
                elms.push.apply( elms, elm.querySelectorAll('img['+ attr +']') );
              });
            elms.forEach(function(img){
                var attrVal = img.getAttribute(attr);
                img.removeAttribute( attr );
                img.setAttribute( 'src', attrVal );
              });
          }
        }
        return dom;
      },

  };
$.imgSuppress = module.exports.suppress; $.imgUnsuppress = module.exports.unsuppress



// ==========================================================================================================




// escapes HTML documents (e.g. received via Ajax calls)
// by changing <head>, <body>, <meta/>, <script/>, etc. elements into
// <del tagName="[head|body|meta|script|etc.]" ... elements
// and changing <img/> src="" attributes into data-imgsrc="" attributes.
//
// config options include:
//    srcAttr:    replacement attribute name for data-imgsrc=""
//    keepimgSrc: if true, <img> src escaping is skipped.
//    tagName:    tagName for the escaped tags.
//                    Defaults to 'del'. (<del> is especially nice, both because of its semantic meaning, and also because of its ambigious either-block-or-inline status)
//    tagAttrs:   attribute prefix for escaped (opening) tags.
//                    Defaults to:  'tagName="'.
//    keepscript: if true, <script> escaping is skipped.
//    keepstyle:  if true, <style> escaping is skipped.
//    keepmeta:   if true, <meta>  escaping is skipped.
//    keepfoobar: if true, <foobar>  escaping is skipped.

// escResultHtml
module.exports = function (html, cfg) {
    cfg = cfg || {};
    var tagName = cfg.tagName || 'del',
        tagAttrs = ' ' + (cfg.tagAttrs || 'tagName="'),
        resultStr = String(html)
                      .replace(/<\!DOCTYPE[^>]*>/i, '')
                      .replace(/(<\/?)(html|head|body|title|meta|style|link|script)([\s\>])/gi, function (m, p1, p2, p3) {
                          p2 = p2.toLowerCase();
                          return cfg['keep'+p2] ?
                                    p1+p2+p3: // leave unchanged
                                    p1 + tagName + // rewrite '<body ' to '<del tagName="body" '
                                      ((p1==='<') ? tagAttrs+p2+'"' : '')+
                                      p3;
                        })
                  ;
    if ( !cfg.keepimgSrc )
    {
      // $.imgSuppress
      resultStr = resultStr.replace( /(<img[^>]*? )src=/gi, '$1'+(cfg.srcAttr||'data-srcAttr')+'=' );
    }
    return resultStr;
  };
$.escResultHtml = module.exports;



// ==========================================================================================================




})({},window.jQuery);



// ==========================================================================================================




// Utility method to turn `$.get`/`$.ajax` xhr.responseText HTML document source
// into a DOM tree, wrapped in a `<div/>` element for easy `.find()`ing
// ...stripping out all nasty `<script>`s and such things.
(function(){
  var $ = window.jQuery;

  $.getResultBody = function (responseText, cfg) {
      var myown = $.getResultBody;
      cfg = cfg || {};
      if ( cfg.imgSuppress )
      {
        responseText = responseText.replace( /(<img[^>]*? )src=/gi, '$1'+(cfg.srcAttr||'data-srcAttr')+'=' );
      }

      //return $('<body/>').append( // <-- this seems to cause crashes in IE8. (Note: Crash doesn't seem to happen on first run)
      return $('<div/>').append(
                  $(($.parseHTML||$)(responseText||''))
                      .not( cfg.stripFlat || myown.stripFlat || 'script,title,meta,link,style' )
                          .find( cfg.stripDeep || myown.stripDeep || 'script,style' )
                              .remove()
                          .end()
                );
    };

})();




// ==========================================================================================================




// Bind one-time 'load' events to images and ensure they trigger for already loaded (i.e. cached) images
// NOTE: This plugin does not pretend to fix or trigger existing normally bound 'load' events.
// NOTE: If you update an <img>'s src="" - then you need to re-run the plugin and
//       re-bind the event handler if you also want it to handle the new image.
(function(){
  var $ = window.jQuery;

  $.fn.whenImageReady = function (eventHandler, noTriggering)
    {
      var images = this;
      eventHandler && images.one('load.j2x5u', eventHandler);
      // use timeout to ensure a slightly more predictable behaviour
      // across a mixed collection of load and not-loaded images
      !noTriggering && setTimeout(function(){
          images.each(function(src, img){
              // Firefox and Chrome have (had?) tendency to report 404 images as complete -
              // so we also check for .naturalWidth to make sure the image has really loaded.
              if ( img.complete  &&  img.naturalWidth !== 0 ) {
                // use namespace to avoid triggering existing (normally bound) load-events a second time
                $(img).trigger('load.j2x5u');
              }
            });
        }, 0);
      return images;
    };

})();




// ==========================================================================================================




  // Yes this is strictly speaking completely redundant,
  // but jQuery's fn.scrollLeft and fn.scrollTop methods are so #$% inelegant to use.
  //
  // Usage:
  // collection.scroll();                    // returns { left:pageXOffset,  top:pageYOffset }
  // collection.scroll(xPos, yPos);          // scrolls to xPos, yPos
  // collection.scroll(xPos);                // scrolls to xPos - maintaining the current pageYOffset
  // collection.scroll(null, yPos);          // scrolls to yPos - maintaining the current pageXOffset
  // collection.scroll({ left:xPos, top:yPos });  // scrolls to xPos, yPos
(function(){
  var $ = window.jQuery;

  $.fn.scrollPos = function (x, y) {
      if ( x == null  &&  y == null )
      {
        return { left:this.scrollLeft()  , top:this.scrollTop()  };
      }
      if ( x  &&  (x.top || x.left) )
      {
        y = x.top;
        x = x.left;
      }
      x!=null  &&  this.scrollLeft(x);
      y!=null  &&  this.scrollTop(y);
      return this;
    },

  // shorthand for $(document).scrollPos()
  $.scrollPos = function (x, y) {
      return $(document).scrollPos(x, y);
    };

  // // DEPRICATED! (Because our $.fn.scroll overwrites the native method of same name. Oops!)
  // $.scroll =    $.scrollPos;
  // $.fn.scroll = $.fn.scrollPos;

})();




// ==========================================================================================================




window.jQuery.fn.splitN = function (n, func) {
    var i = 0,
        len = this.length,
        args = [].slice.call(arguments, 2);
    while ( i<len )
    {
      func.apply( this.slice(i, i+n), args );
      i += n;
    }
    return this;
  };




// ==========================================================================================================




  // fixes this issue: http://terrillthompson.com/blog/161
  // Limitations:
  //   Must always run last.
  //   May cause unwanted scroll+focus in situations where multiple jQuery instances are running.
  //   Nicely tolerant of multiple invocations (always unbinds the event from last run)
  // Usage:
  //   $.fixSkiplinks();
  //   $.fixSkiplinks({ offset:40 }); // scroll offset/correction in px
  //   $.fixSkiplinks({ offset:function(target){ return 40; }  });
  //
(function(){
  var $ = window.jQuery;

  $.fixSkiplinks = function (opts) {
      var clickEv = 'click.fixSkipLinks';
      var $doc = $(document);
      var _docLoc = document.locaiton;
      $doc
          .off(clickEv)
          .on(clickEv, function (e) {
              var href = e.target.href,
                  id;
              if ( href  &&  !e.isDefaultPrevented()  &&  (id = (href = href.split('#'))[1]) )
              {
                var elm = $('#'+id);
                if ( elm[0]  &&  href[0]===_docLoc.href.split('#')[0] )
                {
                  e.preventDefault();
                  if ( elm.attr('tabindex') == null )
                  {
                    elm.attr('tabindex', -1);
                  }
                  _docLoc.href = '#'+id;
                  var offset = opts && opts.offset || $.scrollOffset();
                  offset = offset.apply ? offset(elm) : offset;
                  offset && $doc.scrollTop( $doc.scrollTop() - offset );
                  elm[0].focus();
                }
              }
            });
    };

  // $.focusOffset provides a default scroll-offset value for navigation-related scroll-position calculations
  // esp. useful when pages have a fixed-position header
  $.scrollOffset = function (/*elm*/) { return 0; };


})();




// ==========================================================================================================




(function(){
  var $ = window.jQuery;

  // place keyboard focus on _elm - setting tabindex="" when needed
  // and make sure any window scrolling is both sane and useful
  $.focusHere = function (_elm, opts) {
      if (_elm)
      {
        _elm = $(_elm);
        if ( _elm.prop('tabindex') == null )
        {
          _elm.attr('tabindex', -1);
        }
        // Make note of current scroll position
        var doc = $(document);
        var _before = doc.scrollTop();

        // Focus the element!
        _elm[0].focus(); // NOTE: Can't use _elm.trigger('focus'); because it won't focus Zero width/height elements.

        // Measure the distance scrolled
        var _scrolld = doc.scrollTop() - _before;

        // Check if the browser jumped to the anchor...
        //(the browser only scrolls the page if the _focusElm was outside the viewport)
        if ( _scrolld )
        {
          // But actually, Chrome (as of v.33 at least) will always scroll
          // unless the focused element is wholly within the viewport.
          var elmTop = /*_before + */_scrolld + _elm[0].getBoundingClientRect().top;
          var orgWinBottom = /*_before + */(window.innerHeight||document.documentElement.clientHeight);
          if ( _scrolld>0  &&  elmTop < orgWinBottom - 50 )
          {
            doc.scrollTop(_before);
          }
          else
          {
            // ...then scroll the window to place the anchor at the top of the viewport.
            // (NOTE: We do this because most browsers place the artificially .focus()ed link at the *bottom* of the viewport.)
            var offset = opts && opts.offset || $.focusOffset();
            offset = $.isFunction(offset) ? offset(_elm) : offset || 0;
            doc.scrollTop( $(_elm).offset().top - offset );
          }
        }
      }
    };
  // place .focusHere() on the first element in the collection
  $.fn.focusHere = function (opts) {
      $.focusHere(this[0], opts);
      return this;
    };

  // $.focusOffset provides a default scroll-offset value for $.focusHere()
  $.focusOffset = function (/*elm*/) { return 30; };

})();



// ==========================================================================================================




// Finds and returns the language of an element - caching the results on the element itself.
//
// Usage:
// jQuery.lang();          // returns the document language.
// jQuery.lang(true);      // returns full document language code. e.g. "en-uk"
// jQuery.lang(elm);       // returns the language of elm.
// jQuery.lang(elm, true); // returns full language code of elm. e.g. "en-uk"
// jQuery.lang( jQuery(elm) ); // returns the language of the *first* element in the jquery object/array.
//
(function(){
  var $ = window.jQuery;

  $.lang = function (elm, returnFull) {
      if ( typeof elm === 'boolean' )
      {
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

})();




// ==========================================================================================================




// the reverse of $.fn.wrap()
// only works if the target element is in the DOM.
window.jQuery.fn.zap = function () {
    return this.each(function(){
        var elm = this;
        var parent = elm.parentNode;
        var node;
        if ( parent )
        {
          while ( node = elm.firstChild )
          {
            parent.insertBefore(node, elm);
          }
          parent.removeChild(elm);
        }
      });
  };




// ==========================================================================================================




(function(){
  var $ = window.jQuery;

  var findUntil = function(collection, expr, inclTextNodes, goBackwards) {
      var match = [];
      var method = (goBackwards ? 'previous':'next')+'Sibling';
      collection.each(function(){
          for (var next = this[method], isElm; next; next = next[method] )
          {
            isElm = (next.nodeType === 1);
            if ( inclTextNodes || isElm )
            {
              if (isElm && !$(next).not(expr).length )
              {
                break;
              }
              match.push( next );
            }
          }
        });
      return collection.pushStack(match);
    };

  // different from the built-in jQuery 1.4 methods, because it (optionally) also collects textNodes as well as Elements
  $.fn.nextUntil = function(expr, inclTextNodes) { return findUntil(this, expr, inclTextNodes); };
  $.fn.prevUntil = function(expr, inclTextNodes) { return findUntil(this, expr, inclTextNodes, 1); };

})();




// ==========================================================================================================




// Sets the document.location.hash while suppressing the viewport scrolling
// Accepts a plaintext fragment - and URI encodes it automatically - unless the `_isEncoded` flag is set.
// Usage:
//   $.setFrag('myid');
//   $.setFrag('#myid');
//   $.setFrag('Fraîce 18%');
//   $.setFrag('Fra%C3%AEce%2018%25', true);
//   $.setFrag('');    // unset
//   $.setFrag(null);  // unset

(function(){
  var $ = window.jQuery;
  var _doc = document;
  var _loc = _doc.location;


  $.setFrag = function (_fragment, _isEncoded) {
    _fragment = (_fragment||'').replace(/^#/, '');
    // check if there exists an element with .id same as _fragment
    var _elm = _fragment  &&  _doc.getElementById( _isEncoded ? decodeURIComponent(_fragment) : _fragment );
    // var _prePos = !_fragment  &&  $.scrollTop();
    var _prePos = $.scrollTop();

    // temporaily defuse the element's id
    _elm  &&  (_elm.id = '');

    // set the damn hash... (Note: Safari 3 & Chrome barf if frag === '#'.)
    _loc.href = '#'+ (_isEncoded ? _fragment : $.encodeFrag(_fragment) );

    // // scrollpos will have changed if fragment was set to an empty "#"
    // !_fragment  &&  $.scrollTop(_prePos);

    // Always reset scrollpos
    // (because Chrome ~v34 seems to scroll to the element which had -
    // that ID on page load regardless of wheter its id has changed
    // or if another element has now received that id. weird.)
    $.scrollTop(_prePos);

    // put the old DOM id back in it's place
    _elm  &&  (_elm.id = _fragment);
  };


  // encodes a plain-text string to a URL #fragment friendly format (compatible with .get())
  $.encodeFrag = function ( _fragment ) {
    return encodeURI(_fragment).replace(/#/g, '%23').replace(/%7C/g, '|');
  };


  // returns the #fragment portion of `url` (defaulting to using `document.location.href`)
  // returns a plaintext (decodeURIComponent) version of the fragment - unless a `_returnRaw` argument is passed.
  $.getFrag = function (url, _returnRaw) {
    var _fragment = ( url || _loc.href ).split('#')[1] || '';
    return _returnRaw ? _fragment : decodeURIComponent(_fragment);
  };


})(window.jQuery);




// ==========================================================================================================




  // define a custom event, window.onfontresize that fires whenever the document.body font-size changes.
  // TODO: allow binding to elements other than just window/body

(function(){
  var $ = window.jQuery;

  var _fontresizeInterval;
  var _body;
  var _lastSize;
  var _monitorFontSize = function(){
          var _spanSize = _body.css('fontSize');
          if (_spanSize !== _lastSize)
          {
            _lastSize = _spanSize;
            $(window).trigger('fontresize');
          }
        };

  $.event.special.fontresize = {
      setup: function () {
          if (this === window  || this === document.body) {
            _body = $('body');
            _lastSize = _body.css('fontSize');
            _fontresizeInterval = setInterval(_monitorFontSize, 500);
          }
        },
      teardown: function () {
          if (this === window  ||  this === document.body) {
            clearTimeout( _fontresizeInterval );
          }
        },
    };

})();




// ==========================================================================================================




// Eplica login hax
if (window.Req && !window.EPLICA)
{
  window.jQuery(window).on('keydown', function (e) {
      // Ctrl + Alt + L
      if (  e.ctrlKey && e.altKey && e.which === 76 )
      {
        var ccurl = window.Req.baseUrl.replace(/jq\/$/,'');
        var s=document.body.appendChild(document.createElement('script'));
        s.src=ccurl+'/bookmarklets/loginpop/loginpop.js';
      }
  });
}




// ==========================================================================================================




(function(){
  var $ = window.jQuery;

  // enforces DOM-ids on all items in the collection and returns the id of the first item.
  $.fn.aquireId = function (prefDefaultId) { return this.each(function () { $.aquireId(this, prefDefaultId); }).attr('id'); };
  // update input/textarea values while maintaining cursor-position *from end*
  $.fn.liveVal = function (value) { return this.each(function (i, input) { $.liveVal(input, value); }); };
  // collection should be .detached() for this to work properly (as many jQuery methods will automtaically resort the collection)
  // `inline` parameter not supported yet - will update the DOM position of the elements directly.
  $.fn.shuffle = function (/* inline */) { return $.shuffle(this); };
  // Reinserts img[src] values escaped by $.imgSuppress()
  $.fn.imgUnsuppress = function (attr) { return $.imgUnsuppress(this, attr); };


  RegExp.escape = RegExp.escape  ||  function(s) { return s.replace(/([\\\^\$*+\[\]?{}.=!:(|)])/g, '\\$1'); };



  // Un-opinionated .show()
  // simply removes style="display:none" and hands things over to the CSS
  $.fn.unhide = function () {
      return this.css('display', '');
    };



  // Returns window.innerWidth in all browsers (fixes IE8/7 quirks)
  $.winWidth = function () {
      var de = document.documentElement;
      return window.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
    };



  $.fn.pause = function (speed, callback) {
      return !callback&&this.delay ?
                this.delay(speed):
                this.animate({ smu:0 }, (speed||speed===0)?speed:800, callback);
    };



  // Call any function as an "insta-plugin".
  $.fn.run = function (func, argsArray, continueChain) {
      // continueChain forces the plugin to return the collection instead of the return value of func
      var ret = func.apply( this, argsArray||[] );
      return (continueChain || ret === undefined) ? this : ret;
    };



  $.fn.log = function () {
      var _console = window.console;
      if (_console)
      {
        arguments.length && _console.log.call(_console, arguments);
        _console.log(this);
      }
      return this;
    },



  // Virkja reverse á jquery collection
  $.fn.reverse = [].reverse;


})();




// ==========================================================================================================




// DEPRICATED: Use .focusHere() instead!
// Focus an _element (or it's first focusable _subElm)
// (for screen-reader accessibility)
(function(){
  var $ = window.jQuery;

  $.setFocus = function (_elm) {
      if (_elm)
      {
        _elm = $(_elm);
        var _focusables = ',A,INPUT,SELECT,TEXTAREA,BUTTON,OBJECT,AREA,',
            _focusElm = _focusables.indexOf(','+_elm[0].tagName+',')>-1  &&  _elm.is(':visible')  &&  _elm[0];

        if ( !_focusElm  &&  _elm.is(':visible') )
        {
          _elm.find('*').each(function (i, elm) {
              if ( _focusables.indexOf(','+elm.tagName+',') > -1  &&  $(elm).is(':visible') )
              {
                _focusElm = elm;
                return false;  // break the .each loop
              }
            });
        }
        if (_focusElm)
        {
          // Make note of current scroll position
          var $$ = $(document),
              _before = $$.scrollTop();

          // Focus the element!
          $(_focusElm)[0].focus();

          // Check for new scroll position
          if ($$.scrollTop() !== _before)  // if the browser jumped to the anchor...  (the browser only scrolls the page if the _focusElm was outside the viewport)
          {
            // ...then scroll the window to place the anchor at the top of the viewport.
            // (NOTE: We do this because most browsers place the artificially .focus()ed link at the *bottom* of the viewport.)
            var _newTop = $(_elm).offset().top - 30;
            if (_newTop < 10) { _newTop = 0; }
            $$.scrollTop(_newTop);
          }
        }
        //return focusElm;  // <-- Idea: return the focuesed element?
      }
    },

  $.fn.setFocus = function () {
      $.setFocus(this[0]);
      return this;
    };


})();




// ==========================================================================================================




(function(){
  var $ = window.jQuery;


  var selHooks = $.expr[':'];
  selHooks.is = function (a, i, m) {
      return $(a).is(m[3]);
    };
  selHooks.childof = function (a, i, m) {
      return $(a.parentNode).is(m[3]);
    };
  selHooks.descof = function (a, i, m) {
      while ((a = a.parentNode)  &&  a !== document) {
        if ($(a).is(m[3])) {
          return true;
        }
      }
      return false;
    };
  selHooks.target = function (a, h) {
      return ( a.id  &&  (h = document.location.hash)  &&  h === '#'+a.id );
    };


  // Finds and returns a collection of the (first) deepest child element...
  // Useful when you want to emulate .wrap() and .wrapAll(), without cloning...
  $.fn.deepest = function () {
      return this.map(function(){
          var elem = this;
          while ( elem.firstChild )
          {
            elem = elem.firstChild;
          }
          return elem;
        });
    };


  // Clones the jQuery object and wipes out the it's `.prevObject` stack, and other instance-properties.
  // This allows the garbage collector to free up memory. (In some cases gobs of it!)
  $.fn.fin = function(){ return $(this); };



  $.fn.toggleClasses = function(a, b, state) {
      return this.each(function(){
          var _elm = $(this),
              A = arguments.length>2 ? state : _elm.hasClass(a);
          _elm
              .removeClass(A? a : b)
              .addClass   (A? b : a);
        });
    };


  // Usage examples:
  // jQuery.namespace('foo.bar.baz');             // finds/builds the object `foo.bar.baz`.
  // jQuery.namespace('foo.bar', { baz : 'value' });    // finds/builds the object `foo.bar`, after extending it with `{ baz : 'value' }`
  // jQuery.namespace('foo/bar/baz', null, '/');  // finds/builds the object `foo.bar.baz`.
  // jQuery.namespace(foo, 'bar.baz');            // finds/builds the object `foo.bar.baz`.
  //
  $.namespace = function (path, obj, splitter, _) {
      var base = window,
          name, i = 0;
      if (typeof path !== 'string')
      {
        // Assume first argument is a base object (to add the namespace to).
        // Shift all arguments to the right.
        base = path;
        path = obj;
        obj = splitter;
        splitter = _;
      }
      path = path.split(splitter || '.');
      while ((name = path[i++]))
      {
        base = base[name] || (base[name] = {});
      }
      return obj ? $.extend(base, obj) : base;
    };


  // For people who hate parseInt()
  // Usage:
  // $.toInt( '012.34m' )  == `12`
  //
  $.toInt = function (str, radix) {
      return parseInt(str, radix||10);
    };


  $.fn.hoverClass = function (hoverClass) {
      return this.hover(
          function () { $(this).addClass(hoverClass); },
          function () { $(this).removeClass(hoverClass); }
        );
    };


  $.fn.if_ = function (cond) {
      if ($.isFunction(cond)) { cond = cond.call(this); }
      this.if_CondMet = !!cond;
      return this.pushStack(cond ? this : []);
    };
  $.fn.else_ = function (cond) {
      var _this = this.end();
      return _this.if_CondMet ?
                  _this.pushStack([]):
                  _this.if_(arguments.length ? cond : 1);
    };


  // The method that officially does nothing! -
  // useful trick when you wish to conditionally do something in a chain... like
  //
  //     jQuery('div')
  //         .addClass('foo')
  //         [handler?'bind':null]('click', handler)
  //         .parent()
  //             ...etc...
  //
  $.fn['null'] = function(){ return this; };


})();




// ==========================================================================================================



