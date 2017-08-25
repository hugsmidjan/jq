(function () {
'use strict';

/* jQuery extra utilities 1.3  -- (c) 2010-2017 Hugsmiðjan ehf.  @preserve */
// ----------------------------------------------------------------------------------
// Miscellaneous jQuery utilities collection v 1.3
// ----------------------------------------------------------------------------------
// (c) 2010-2017 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
//   * Valur Sverrisson     -- valur@hugsmidjan.is
// ----------------------------------------------------------------------------------

// Usage:
//   aquireId();                         // returns a valid unique DOM id string that can be safely assigned to an element.
//   aquireId(prefDefaultIdString);      // returns a valid unique DOM id based on `prefDefaultIdString` (appending/autoincrementing a trailing integer if needed)
//   aquireId(elm);                      // returns the value of elm.id -- automatically assigning a unique id first, if needed.
//   aquireId(elm, prefDefaultIdString); // returns the value of elm.id -- if needed automatically assigning a unique id based on `prefDefaultIdString`.
//

// suffix and prefix used to generate temporary @id-values for HTMLelements without an @id
var _guidPrefix = 'tmp_' + Date.now() + '_';
// a counter that should be incremented with each use.
var _guid = 1;

// aquireId
function aquireId(el, prefDefaultId) { // el is an optional parameter.
  if (typeof el === 'string') {
    prefDefaultId = el;
    el = undefined;
  }
  if ( el ) {
    el = el.nodeType ? el : el[0];
  }
  if (!el || !el.id) {
    var id = prefDefaultId  ||  _guidPrefix + _guid++;
    if (prefDefaultId) {
      var count;
      while ( document.getElementById(id) ) {
        if (count === undefined) {
          var m = prefDefaultId.match(/\d+$/);
          count = m ? parseInt(m[0],10) : 1;
          prefDefaultId = m ? prefDefaultId.replace(/\d+$/, '') : prefDefaultId;
        }
        count++;
        id = prefDefaultId + count;
      }
    }
    if (!el) { return id; }
    if (!el.id) { el.id = id; }
  }
  return el.id;
}

var $$1 = window.jQuery;

$$1.aquireId = aquireId;
// enforces DOM-ids on all items in the collection and returns the id of the first item.
$$1.fn.aquireId = function (prefDefaultId) { return this.each(function () { aquireId(this, prefDefaultId); }).attr('id'); };

// Prototypal inheritance
var F = function () {};
var hasOwnProperty = Object.prototype.hasOwnProperty;

function beget(proto, props) {
  F.prototype = proto;
  var o = new F();
  if ( props ) {
    for (var key in props) {
      if ( !hasOwnProperty.call(props, key) ) {
        o[key] = props[key];
      }
    }
  }
  return o;
}

window.jQuery.beget = beget;

var _reCache = {};

function cropText(str, length, end) {
  end = end || ' ...';
  str = str.trim().replace(/\s+/g, ' ');
  if ( length  &&  str.length > length+end.length ) {
    var hash = length +'~~'+end;
    var re = _reCache[hash] || (_reCache[hash] = new RegExp('^(.{0,'+length+'})\\s.+$'));
    var newTxt = str.replace(re, '$1');
    return newTxt + (newTxt.length<str.length ? end : '');
  }
  return str;
}

window.jQuery.cropText = cropText;

// debounceFn()
// returns a debounced function that only runs after `delay` milliseconds of quiet-time
// the returned function also has a nice .cancel() method.
function debounce(func, delay, immediate) {
  if ( typeof delay === 'boolean' ) {
    immediate = delay;
    delay = 0;
  }
  delay = delay || 50;
  var timeout;
  var debouncedFn = !immediate ?
      // simple delayed function
      function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var _this = this;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          func.apply(_this, args);
        }, delay);
      }:
      // more complex immediately called function
      function () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        var runNow = !timeout && immediate;
        var _this = this;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
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
}

window.jQuery.debounceFn = debounce;

// Finds and returns a collection of the (first) deepest child element...
// Useful when you want to emulate .wrap() and .wrapAll(), without cloning...
window.jQuery.fn.deepest = function () {
  return this.map(function () {
      var elem = this;
      while ( elem.firstChild ) {
        elem = elem.firstChild;
      }
      return elem;
    });
};

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
window.jQuery.escResultHtml = function (html, cfg) {
  cfg = cfg || {};
  var tagName = cfg.tagName || 'del';
  var tagAttrs = ' ' + (cfg.tagAttrs || 'tagName="');
  var resultStr = String(html)
      .replace(/<\!DOCTYPE[^>]*>/i, '')
      .replace(/(<\/?)(html|head|body|title|meta|style|link|script)([\s\>])/gi, function (m, p1, p2, p3) {
        p2 = p2.toLowerCase();
        return cfg['keep'+p2] ?
                  p1+p2+p3: // leave unchanged
                  p1 + tagName + // rewrite '<body ' to '<del tagName="body" '
                    ((p1==='<') ? tagAttrs+p2+'"' : '')+
                    p3;
      });
  if ( !cfg.keepimgSrc ) {
    // $.imgSuppress
    resultStr = resultStr.replace( /(<img[^>]*? )src=/gi, '$1'+(cfg.srcAttr||'data-srcAttr')+'=' );
  }
  return resultStr;
};

var $$2 = window.jQuery;

var findUntil = function (collection, expr, inclTextNodes, goBackwards) {
  var match = [];
  var method = (goBackwards ? 'previous':'next')+'Sibling';
  collection.each(function () {
    for (var next = this[method], isElm; next; next = next[method] ) {
      isElm = (next.nodeType === 1);
      if ( inclTextNodes || isElm ) {
        if (isElm && !$$2(next).not(expr).length ) {
          break;
        }
        match.push( next );
      }
    }
  });
  return collection.pushStack(match);
};

// different from the built-in jQuery 1.4 methods, because it (optionally) also collects textNodes as well as Elements
$$2.fn.nextUntil = function (expr, inclTextNodes) { return findUntil(this, expr, inclTextNodes); };
$$2.fn.prevUntil = function (expr, inclTextNodes) { return findUntil(this, expr, inclTextNodes, 1); };

/*
  fixes this issue: http://terrillthompson.com/blog/161
  Limitations:
    * Must always run last.
    * May cause unwanted scroll+focus in situations
      where multiple jQuery instances are running.
    * Nicely tolerant of multiple invocations
      (always unbinds the event from last run)
  Usage:
    $.fixSkiplinks();
    $.fixSkiplinks({ offset:40 }); // scroll offset/correction in px
    $.fixSkiplinks({ offset:function(target){ return 40; }  });
*/
var $$3 = window.jQuery;

$$3.fixSkiplinks = function (opts) {
  var clickEv = 'click.fixSkipLinks';
  var doc = document;
  var docLoc = doc.location;
  var offsetFn =  !opts || opts.offset == null ?
                      $$3.scrollOffset:
                  opts.offset.apply ?
                      opts.offset:
                      function () { return opts.offset; };
  $$3(doc)
      .off(clickEv)
      .on(clickEv, function (e) {
        if ( e.target.href ) {
          var hrefBits = e.target.href.split('#');
          var id = hrefBits[1];
          if ( id  &&  !e.isDefaultPrevented() ) {
            var elm = $$3(doc.getElementById( id ));
            if ( elm[0]  &&  hrefBits[0] === docLoc.href.split('#')[0] ) {
              e.preventDefault();
              var hadNoTabindex = elm.attr('tabindex') == null;
              if ( hadNoTabindex ) {
                elm.attr('tabindex', -1);
              }
              docLoc.href = '#'+id;
              var offset = offsetFn(elm);
              if ( offset ) {
                setTimeout(function () {
                  doc.body.scrollTop -= offset;
                  doc.documentElement.scrollTop -= offset;
                  elm[0].focus();
                  elm[0].blur();
                  if ( hadNoTabindex ) {
                    setTimeout(function () { elm.removeAttr('tabindex'); }, 0);
                  }
                }, 0);
              }
            }
          }
        }
      });
  // // NOTE: this will fuck up page loads where tabswitcher scripts are present, etc.
  var currentHash = docLoc.hash.replace(/^#/,'');
  var elm = currentHash && document.getElementById(currentHash);
  var elmTop = elm && elm.getBoundingClientRect().top;
  if ( elmTop != null ) {
    var overShot = offsetFn() - elmTop;
    if ( overShot > 0 ) {
      doc.body.scrollTop -= overShot;
      doc.documentElement.scrollTop -= overShot;
    }
  }
};

// $.focusOffset provides a default scroll-offset value for navigation-related scroll-position calculations
// esp. useful when pages have a fixed-position header
$$3.scrollOffset = function (/*elm*/) { return 0; };

// place keyboard focus on _elm - setting tabindex="" when needed
// and make sure any window scrolling is both sane and useful
function focusElm(_elm, opts) {
  if (_elm) {
    if ( _elm.tabIndex < 0 ) {
      _elm.setAttribute('tabindex', -1);
    }

    // Make note of current scroll position
    var _before = window.pageYOffset;

    // Focus the element!
    _elm.focus();

    // Measure the distance scrolled
    var _scrolld = window.pageYOffset - _before;

    // Check if the browser jumped to the anchor...
    // (the browser only scrolls the page if the _focusElm was outside the viewport)
    if ( _scrolld ) {
      // But actually, Chrome (as of v.33 at least) will always scroll
      // unless the focused element is wholly within the viewport.
      var elmTop = /*_before + */_scrolld + _elm.getBoundingClientRect().top;
      var orgWinBottom = /*_before + */(window.innerHeight||document.documentElement.clientHeight);
      if ( _scrolld>0  &&  elmTop < orgWinBottom - 50 ) {
        window.scrollTo(window.pageXOffset, _before);
      }
      else {
        // ...then scroll the window to place the anchor at the top of the viewport.
        // (NOTE: We do this because most browsers place the artificially .focus()ed link at the *bottom* of the viewport.)
        var offset = opts && opts.offset;
        var offsetPx = offset.apply ? offset(_elm) : offset || 0;
        var elmTopPos = _elm.getBoundingClientRect().top + document.body.scrollTop;
        window.scrollTo( window.pageXOffset,  elmTopPos - offsetPx );
      }
    }
  }
}

var $$4 = window.jQuery;

$$4.focusHere = function (_elm, opts) {
  if ( _elm.length ) {
    _elm = _elm[0];
  }
  opts = opts || {};
  opts.offset = opts.offset || $$4.focusOffset();
  focusElm(_elm, opts);
};

// place .focusHere() on the first element in the collection
$$4.fn.focusHere = function (opts) {
  $$4.focusHere(this[0], opts);
  return this;
};

// $.focusOffset provides a default scroll-offset value for $.focusHere()
$$4.focusOffset = function (/*elm*/) { return 30; };

// Sets the document.location.hash while suppressing the viewport scrolling
// Accepts a plaintext fragment - and URI encodes it automatically - unless the `_isEncoded` flag is set.
// Usage:
//   setFrag('myid');
//   setFrag('#myid');
//   setFrag('Fraîce 18%');
//   setFrag('Fra%C3%AEce%2018%25', true);
//   setFrag('');    // unset
//   setFrag(null);  // unset

var setFrag = function (_fragment, _isEncoded) {
  _fragment = (_fragment||'').replace(/^#/, '');
  // check if there exists an element with .id same as _fragment
  var _elm = _fragment  &&  document.getElementById( _isEncoded ? decodeURIComponent(_fragment) : _fragment );
  // var _prePos = !_fragment  &&  $.scrollTop();
  var _prePos = document.body.scrollTop||document.documentElement.scrollTop;
  var _tmpId = _elm && _elm.id;

  // temporaily defuse the element's id
  _elm  &&  (_elm.id = '');

  // set the damn hash... (Note: Safari 3 & Chrome barf if frag === '#'.)
  document.location.hash = (_isEncoded ? _fragment : encodeFrag(_fragment) );

  // Always reset scrollpos
  // (because Chrome ~v34 seems to scroll to the element which had -
  // that ID on page load regardless of wheter its id has changed
  // or if another element has now received that id. weird.)
  window.scrollTo( 0, _prePos);

  // put the old DOM id back in it's place
  _elm  &&  (_elm.id = _tmpId);
};


// encodes a plain-text string to a URL #fragment friendly format (compatible with .get())
var encodeFrag = function (_fragment) {
  return encodeURI(_fragment).replace(/#/g, '%23').replace(/%7C/g, '|');
};


// returns the #fragment portion of `url` (defaulting to using `document.location.href`)
// returns a plaintext (decodeURIComponent) version of the fragment - unless a `_returnRaw` argument is passed.
var getFrag = function (url, _returnRaw) {
  var _fragment = ( url || document.location.href ).split('#')[1] || '';
  return _returnRaw ? _fragment : decodeURIComponent(_fragment);
};


var frag = {
  get: getFrag,
  set: setFrag,
  encode: encodeFrag,
};

var $$5 = window.jQuery;
$$5.getFrag = frag.get;
$$5.setFrag = frag.set;
$$5.encodeFrag = frag.encode;

// Utility method to turn `$.get`/`$.ajax` xhr.responseText HTML document source
// into a DOM tree, wrapped in a `<div/>` element for easy `.find()`ing
// ...stripping out all nasty `<script>`s and such things.
var $$6 = window.jQuery;

$$6.getResultBody = function (responseText, cfg) {
  var myown = $$6.getResultBody;
  cfg = cfg || {};
  if ( cfg.imgSuppress ) {
    responseText = responseText.replace( /(<img[^>]*? )src=/gi, '$1'+(cfg.srcAttr||'data-srcAttr')+'=' );
  }

  //return $('<body/>').append( // <-- this seems to cause crashes in IE8. (Note: Crash doesn't seem to happen on first run)
  return $$6('<div/>')
      .append(
        $$6(($$6.parseHTML||$$6)(responseText||''))
            .not( cfg.stripFlat || myown.stripFlat || 'script,title,meta,link,style' )
                .find( cfg.stripDeep || myown.stripDeep || 'script,style' )
                    .remove()
                .end()
      );
};

var $$7 = window.jQuery;

$$7.fn.if_ = function (cond) {
  if ($$7.isFunction(cond)) { cond = cond.call(this); }
  this.if_CondMet = !!cond;
  return this.pushStack(cond ? this : []);
};

$$7.fn.else_ = function (cond) {
  var _this = this.end();
  return _this.if_CondMet ?
              _this.pushStack([]):
              _this.if_(arguments.length ? cond : 1);
};

// Escape img[src] values in incoming Ajax html result bodies to avoid automatic preloading of all images.
// don't use data-src="" by default - to avoid conflict with data-src="" set on the server-side as a part of deliberate lazyloading, etc.

var $$8 = window.jQuery;

$$8.imgSuppress = function (html, attr) {
  return html && html.replace( /(<img[^>]*? )src=/gi, '$1'+(attr||'data-srcAttr')+'=' );
};

$$8.imgUnsuppress = function (dom, attr) {
  if ( dom ) {
    attr = attr || 'data-srcAttr';
    if ( typeof dom === 'string') {
      dom = dom.replace( new RegExp('(<img[^>]*? )'+attr+'=', 'gi') ,'$1src=' );
    }
    else {
      var elms = [];
      var domArr = dom.nodeType ? [dom] : [].slice.call(dom);
      domArr.forEach(function (elm) {
        if ( elm.nodeName === 'img' && elm.hasAttribute(attr) ) {
          elms.push(elm);
        }
        elms.push.apply( elms, elm.querySelectorAll('img['+ attr +']') );
      });
      elms.forEach(function (img) {
        var attrVal = img.getAttribute(attr);
        img.removeAttribute( attr );
        img.setAttribute( 'src', attrVal );
      });
    }
  }
  return dom;
};

// Reinserts img[src] values escaped by $.imgSuppress()
$$8.fn.imgUnsuppress = function (attr) { return $$8.imgUnsuppress(this, attr); };

function regEscape(s) {
  return s.replace(/([\\\^\$*+\[\]?{}.=!:(|)])/g, '\\$1');
}

// Simple String templating (variable injection) that accepts either arrays or hash-maps.
// Usage:
// var output = inject('Hello %{1}! Hava a %{0}', ['banana', 'John']);                           // Returns  'Hello John! Have a banana'
// var output = inject('Hello %{name}! Hava a %{food}', { food : 'banana', person : 'John' });   // Returns  'Hello John! Have a banana'
//
var _injectRegExpCache = {}; // used by $.inject(); to store regexp objects.

function inject(template, _vars) {
  var _keys = [];
  var l = _vars.length;
  var i;
  var resultString = template;
  // fail early to save time
  if ( resultString.indexOf('%{') > -1 ) {
    // NOTE: this is a fairly ugly way to collect the "keys" depending on if _vars is a List or an Object.
    if (isNaN(l)) {
      for (i in _vars) { _keys.push(i); }
    }
    else {
      while (l--) { _keys.push(l); }
    }
    // now loop through the _keys and perform the replacement
    i = _keys.length;
    while (i--) {
      var _key = _keys[i];
      var re = _injectRegExpCache[_key];
      if ( !re ) {
        re = new RegExp(regEscape('%{'+_key+'}'),'g');
        _injectRegExpCache[_key] = re;
      }
      resultString = resultString.replace(re, _vars[_key]);
    }
  }
  return resultString;
}

window.jQuery.inject = inject;

// Finds and returns the language of an element - caching the results on the element itself.
//
// Usage:
// jQuery.lang();          // returns the document language.
// jQuery.lang(true);      // returns full document language code. e.g. "en-uk"
// jQuery.lang(elm);       // returns the language of elm.
// jQuery.lang(elm, true); // returns full language code of elm. e.g. "en-uk"
// jQuery.lang( jQuery(elm) ); // returns the language of the *first* element in the jquery object/array.
//
var $$9 = window.jQuery;

$$9.lang = function (elm, returnFull) {
  if ( typeof elm === 'boolean' ) {
    returnFull = elm;
    elm = null;
  }
  var lang = $$9(elm||'html').closest('[lang]').attr('lang') || '';
  return lang ?
      (!returnFull ? lang.substr(0,2) : lang).toLowerCase():
      null;
};

// returns the lang="" value of the first item in the collection
$$9.fn.lang = function (returnFull) {
  return $$9.lang(this[0], returnFull);
};

// liveVal
// update input/textarea values while maintaining cursor-position *from end*
function liveVal(input, value) {
  var delta = value.length - input.value.length;
  var selStart = input.selectionStart + delta;
  var selEnd = input.selectionEnd + delta;
  input.value = value;
  if ( input.setSelectionRange ) {
    input.setSelectionRange(selStart, selEnd);
  }
}

var $$10 = window.jQuery;

$$10.liveVal = liveVal;
// update input/textarea values while maintaining cursor-position *from end*
$$10.fn.liveVal = function (value) {
  return this.each(function (i, input) { liveVal(input, value); });
};

// define a custom event, window.onfontresize that fires whenever the document.body font-size changes.
// TODO: allow binding to elements other than just window/body
var $$11 = window.jQuery;

var _fontresizeInterval;
var _body;
var _lastSize;
var _monitorFontSize = function () {
  var _spanSize = _body.css('fontSize');
  if (_spanSize !== _lastSize) {
    _lastSize = _spanSize;
    $$11(window).trigger('fontresize');
  }
};

$$11.event.special.fontresize = {

  setup: function () {
    if (this === window  || this === document.body) {
      _body = $$11('body');
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

// Pause an animation for duration milliseconds
window.jQuery.fn.pause = function (duration, callback) {
  return !callback&&this.delay ?
      this.delay(duration):
      this.animate({ smu:0 }, (duration||duration===0)?duration:800, callback);
};

// Yes this is strictly speaking completely redundant,
  // but jQuery's fn.scrollLeft and fn.scrollTop methods are so #$% inelegant to use.
  //
  // Usage:
  // collection.scroll();                    // returns { left:pageXOffset,  top:pageYOffset }
  // collection.scroll(xPos, yPos);          // scrolls to xPos, yPos
  // collection.scroll(xPos);                // scrolls to xPos - maintaining the current pageYOffset
  // collection.scroll(null, yPos);          // scrolls to yPos - maintaining the current pageXOffset
  // collection.scroll({ left:xPos, top:yPos });  // scrolls to xPos, yPos
var $$12 = window.jQuery;

$$12.fn.scrollPos = function (x, y) {
  if ( x == null  &&  y == null ) {
    return {
      left:this.scrollLeft(),
      top:this.scrollTop(),
    };
  }
  if ( x  &&  (x.top || x.left) ) {
    y = x.top;
    x = x.left;
  }
  x!=null  &&  this.scrollLeft(x);
  y!=null  &&  this.scrollTop(y);
  return this;
};

// shorthand for $(document).scrollPos()
$$12.scrollPos = function (x, y) {
  return $$12(document).scrollPos(x, y);
};

// // DEPRICATED! (Because our $.fn.scroll overwrites the native method of same name. Oops!)
// $.scroll =    $.scrollPos;
// $.fn.scroll = $.fn.scrollPos;

function reloadPage(url) {
  var _docLoc = document.location;
  var _docHref = _docLoc.href;
  url = url || _docHref;
  // juggling ?/& suffixes is neccessary to 100% guarantee a reload.
  if ( url === _docHref ) {
    var blah =  !/\?/.test(url) ?
                    '?':
                  !/[&?](?:#|$)/.test(url) ?
                    '&':
                    '';
    url = url.replace(/[&?]?(#.*)?$/, blah+'$1');
  }
  _docLoc.replace( url );
}

window.jQuery.reloadPage = reloadPage;

// DEPRICATED: Use .focusHere() instead!
// Focus an _element (or it's first focusable _subElm)
// (for screen-reader accessibility)
var $$13 = window.jQuery;

$$13.setFocus = function (_elm) {
  if (_elm) {
    _elm = $$13(_elm);
    var _focusables = ',A,INPUT,SELECT,TEXTAREA,BUTTON,OBJECT,AREA,';
    var _focusElm = _focusables.indexOf(','+_elm[0].tagName+',')>-1  &&  _elm.is(':visible')  &&  _elm[0];

    if ( !_focusElm  &&  _elm.is(':visible') ) {
      _elm.find('*').each(function (i, elm) {
        if ( _focusables.indexOf(','+elm.tagName+',') > -1  &&  $$13(elm).is(':visible') ) {
          _focusElm = elm;
          return false;  // break the .each loop
        }
      });
    }
    if (_focusElm) {
      // Make note of current scroll position
      var $$ = $$13(document);
      var _before = $$.scrollTop();

      // Focus the element!
      $$13(_focusElm)[0].focus();

      // Check for new scroll position
      if ($$.scrollTop() !== _before) {
        // if the browser jumped to the anchor...  (the browser only scrolls the page if the _focusElm was outside the viewport)
        // ...then scroll the window to place the anchor at the top of the viewport.
        // (NOTE: We do this because most browsers place the artificially .focus()ed link at the *bottom* of the viewport.)
        var _newTop = $$13(_elm).offset().top - 30;
        if (_newTop < 10) { _newTop = 0; }
        $$.scrollTop(_newTop);
      }
    }
    //return focusElm;  // <-- Idea: return the focuesed element?
  }
};

$$13.fn.setFocus = function () {
  $$13.setFocus(this[0]);
  return this;
};

// shuffle the contents of an array
function shuffle(array, mutate) {
  array = mutate ? [].slice.call(array) : array;
  var left = array.length;
  while (left) {
    var p = Math.floor( left * Math.random(left--) );
    var t = array[left];
    array[left] = array[p];
    array[p] = t;
  }
  return array;
}

var $$14 = window.jQuery;

$$14.shuffle = function (arr, immutable) { return shuffle(arr, !immutable); };
// collection should be .detached() for this to work properly (as many jQuery methods will automtaically resort the collection)
// `inline` parameter not supported yet - will update the DOM position of the elements directly.
$$14.fn.shuffle = function () { return shuffle(this, true); };

window.jQuery.fn.splitN = function (n, func) {
  var this$1 = this;

  var i = 0;
  var len = this.length;
  var args = [].slice.call(arguments, 2);
  while ( i<len ) {
    func.apply( this$1.slice(i, i+n), args );
    i += n;
  }
  return this;
};

// throttleFn()
// returns a throttled function that never runs more than every `delay` milliseconds
// the returned function also has a nice .finish() method.
function throttle(func, delay, skipFirst) {
  if ( typeof delay === 'boolean' ) {
    skipFirst = delay;
    delay = 0;
  }
  delay = delay || 50;
  var throttled = 0;
  var timeout;
  var _args;
  var _this;
  var throttledFn = function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    _args = args;
    _this = this;
    if (!throttled) {
      skipFirst ?
          throttled++:
          func.apply(_this, _args);
      timeout = setTimeout(throttledFn.finish, delay);
    }
    throttled++;
  };
  throttledFn.finish = function () {
    clearTimeout( timeout );
    throttled>1 && func.apply(_this, _args);
    throttled = 0;
  };
  return throttledFn;
}

window.jQuery.throttleFn = throttle;

function uniqueArray(array) {
  var result = [];
  var length = array.length;
  for (var i = 0; i < length; i++) {
    var value = array[i];
    if ( result.indexOf(value) < 0 ) {
      result.push(value);
    }
  }
  return result;
}

window.jQuery.uniqueArray = uniqueArray;

// Un-opinionated .show()
// simply removes style="display:none" and hands things over to the CSS
window.jQuery.fn.unhide = function () {
  return this.css('display', '');
};

// Bind one-time 'load' events to images and ensure they trigger for already loaded (i.e. cached) images
// NOTE: This plugin does not pretend to fix or trigger existing normally bound 'load' events.
// NOTE: If you update an <img>'s src="" - then you need to re-run the plugin and
//       re-bind the event handler if you also want it to handle the new image.
var $$15 = window.jQuery;

$$15.fn.whenImageReady = function (eventHandler, noTriggering) {
  var images = this;
  eventHandler && images.one('load.j2x5u', eventHandler);
  // use timeout to ensure a slightly more predictable behaviour
  // across a mixed collection of load and not-loaded images
  !noTriggering && setTimeout(function () {
    images.each(function (src, img) {
      // Firefox and Chrome have (had?) tendency to report 404 images as complete -
      // so we also check for .naturalWidth to make sure the image has really loaded.
      if ( img.complete  &&  img.naturalWidth !== 0 ) {
        // use namespace to avoid triggering existing (normally bound) load-events a second time
        $$15(img).trigger('load.j2x5u');
      }
    });
  }, 0);

  return images;
};

function zapElm(elm) {
  var parent = elm && elm.parentNode;
  if ( parent ) {
    while ( elm.firstChild ) {
      parent.insertBefore(elm.firstChild, elm);
    }
    parent.removeChild(elm);
  }
}

// the reverse of $.fn.wrap()
// only works if the target element is in the DOM.
window.jQuery.fn.zap = function () {
  return this.each(function (i, elm) { return zapElm(elm); });
};

// Depricated jQuery Crap

var $$16 = window.jQuery;


var selHooks = $$16.expr[':'];
selHooks.is = function (a, i, m) {
    return $$16(a).is(m[3]);
  };
selHooks.childof = function (a, i, m) {
    return $$16(a.parentNode).is(m[3]);
  };
selHooks.descof = function (a, i, m) {
    while ((a = a.parentNode)  &&  a !== document) {
      if ($$16(a).is(m[3])) {
        return true;
      }
    }
    return false;
  };
selHooks.target = function (a, h) {
    return ( a.id  &&  (h = document.location.hash)  &&  h === '#'+a.id );
  };


// Clones the jQuery object and wipes out the it's `.prevObject` stack, and other instance-properties.
// This allows the garbage collector to free up memory. (In some cases gobs of it!)
$$16.fn.fin = function () { return $$16(this); };



$$16.fn.toggleClasses = function (a, b, state) {
    return this.each(function () {
        var _elm = $$16(this),
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
$$16.namespace = function (path, obj, splitter, _) {
    var base = window,
        name, i = 0;
    if (typeof path !== 'string') {
      // Assume first argument is a base object (to add the namespace to).
      // Shift all arguments to the right.
      base = path;
      path = obj;
      obj = splitter;
      splitter = _;
    }
    path = path.split(splitter || '.');
    while ((name = path[i++])) {
      base = base[name] || (base[name] = {});
    }
    return obj ? $$16.extend(base, obj) : base;
  };


// For people who hate parseInt()
// Usage:
// $.toInt( '012.34m' )  == `12`
//
$$16.toInt = function (str, radix) {
    return parseInt(str, radix||10);
  };


$$16.fn.hoverClass = function (hoverClass) {
    return this.hover(
        function () { $$16(this).addClass(hoverClass); },
        function () { $$16(this).removeClass(hoverClass); }
      );
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
$$16.fn['null'] = function () { return this; };

/*
  Fast CSS support checker and vendor-prefix resolver
  Returns `false` for unsupported css properties.
  For supported css properties it returns an object with
  the properly vendor-prefixed property-name as both
  JavaScript propertyName and in CSS format.

  Examples of use:
  -------------------------------------

      cssSupport('not-supported-property');
  ==>
      false

      cssSupport('transform-origin');
  ==>
      {
        prop: 'WebkitTransformOrigin',
        css: '-webkit-transform-origin'
      }

      cssSupport('transform-origin');
  ==>
      {
        prop: 'WebkitTransformOrigin',
        css: '-webkit-transform-origin'
      }

*/
var cache = {};
var elmStyles;
var vendorsJs = ['Khtml','O','Ms','Moz','Webkit'];
var vendorsCss = ['-khtml-','-o-','-ms-','-moz-','-webkit-'];

function cssSupport( propname ) {
    // lazy initalize elmStyle
    elmStyles = elmStyles || document.createElement('div').style;

    var prop = cache[propname];
    // If this is the first time we're asked about propname
    if ( prop === undefined ) {
      var cssProp;
      var jsProp;
      // Convert propname from CSS style `transform-origin`
      // into JavaScript-style `transformOrigin`
      var PropName = propname.replace(/-([a-z])/g, function (val, chr) { return chr.toUpperCase(); });
      if ( PropName in elmStyles ) {
        // Un-prefixed property is supported!
        jsProp = PropName;
        cssProp = propname;
      }
      else {
        // Capitalize PropName in preparation for vendor-prefixing
        // (i.e. from `transformOrigin` to `TransformOrigin`
        PropName = PropName.replace(/^[a-z]/, function (chr) { return chr.toUpperCase(); });
        var i = vendorsJs.length;
        while (i--) {
          var PrefixedProp = vendorsJs[i] + PropName;
          if ( PrefixedProp in elmStyles ) {
            // Vendor-prefixed property is supported
            jsProp = PrefixedProp;
            cssProp = vendorsCss[i] + propname;
            break;
          }
        }
      }
      // Build the property-name object.
      prop = jsProp ? { prop: jsProp,  css: cssProp } : false;
      // Cache the results
      cache[propname] = prop;
    }
    return prop;
  }

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
function parseParams(paramString) {
  var map = {};
  paramString = ( paramString!=null ? paramString : document.location.search )
                    .trim()
                    .replace(/^[?&]/, '')
                    .replace(/&$/, '');
  if ( paramString ) {
    paramString
        .replace(/\+/g, ' ')
        .split('&')
        .forEach(function (paramBit) {
          var ref = paramBit.split('=');
          var name = ref[0];
          var value = ref[1];
          name = decodeURIComponent(name);
          var values = map[name] || (map[name] = []);
          values.push( decodeURIComponent(value||'') );
        });
  }
  return map;
}

function regEscape$1(s) {
  return s.replace(/([\\\^\$*+\[\]?{}.=!:(|)])/g, '\\$1');
}

// coderjoe zero padding for numbers - http://jsperf.com/left-zero-pad/18
function zeroPad(number, width) {
  var num = Math.abs(number);
  var zeros = Math.max(0, width - Math.floor(num).toString().length );
  zeros = Math.pow(10,zeros).toString().substr(1);
  return (number<0 ? '-' : '') + zeros + num;
}

RegExp.escape = regEscape$1;

var $ = window.jQuery;

$.cssSupport = cssSupport;

$.parseParams = parseParams;


$.zeroPad = zeroPad;




// Returns window.innerWidth in all browsers (fixes IE8/7 quirks)
$.winWidth = function () {
  var de = document.documentElement;
  return window.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
};



// Call any function as an "insta-plugin".
$.fn.run = function (func, argsArray, continueChain) {
  // continueChain forces the plugin to return the collection instead of the return value of func
  var ret = func.apply( this, argsArray||[] );
  return (continueChain || ret === undefined) ? this : ret;
};



$.fn.log = function () {
  var _console = window.console;
  if (_console) {
    arguments.length && _console.log.call(_console, arguments);
    _console.log(this);
  }
  return this;
};


// Virkja reverse á jquery collection
$.fn.reverse = [].reverse;

}());
