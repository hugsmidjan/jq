// encoding: utf-8
// ----------------------------------------------------------------------------------
// Miscellaneous jQuery utilities collection v 1.1
// ----------------------------------------------------------------------------------
// (c) 2010 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

(function($, undefined){

  // depends on jQuery 1.3
  
/*
 TODO:

  * $.fn.outerHTML
  * $.outerHTML
??
  bind
  bindAfter

*/

  var _dummyElm,  // dummy element used by $.setFrag();
      _win = window,
      _doc = document,
      _location = _doc.location,
      _browser = $.browser,
      _msie = _browser.msie  &&  parseInt(_browser.version, 10)<9,

      // suffix and prefix used to generate temporary @id-values for HTMLelements without an @id
      _guidPrefix = 'tmp_' + (new Date()).getTime() + '_',

      // a counter that should be incremented with each use.
      _guid = 1,

      // used by $.beget()
      _F = function(){},

      _injectRegExpCache = {}, // used by $.inject(); to store regexp objects.
      _RegExpEscape = function(s) { return s.replace(/([\\\^\$*+[\]?{}.=!:(|)])/g, '\\$1'); };



  $.extend($.expr[':'], {

      is: function (a, i, m) {
          return $(a).is(m[3]);
        },

      childof: function (a, i, m) {
          return $(a.parentNode).is(m[3]);
        },

      descof: function (a, i, m) {
          while ((a = a.parentNode)  &&  a !== _doc) {
            if ($(a).is(m[3])) {
              return true;
            }
          }
          return false;
        },

      target: function (a, h) {
          return ( a.id  &&  (h = _location.hash)  &&  h == '#'+a.id );
        }

    });




  // jQuery 1.4 supports focusin/focusout events
  if (!_msie  &&  !$.event.special.focusin)
  {
    // does not work in MSIE<=7
    var _RigUpDOMEventAsEventPlugin = function (_type, _DOMtype, _useCapture, _triggerFunc) {
        if (!_msie)
        {
          _triggerFunc = function (e) {
              e = $.event.fix(e);
              e.type = _type;
              return $.event.handle.call(this, e);
            };
          $.event.special[_type] = {
              setup: function () {
                  this.addEventListener( _DOMtype, _triggerFunc, !!_useCapture );
                },
              teardown: function () {
                  this.removeEventListener( _DOMtype, _triggerFunc, !!_useCapture );
                }
            };
        }
      };

    // Implement cross-browser `focusin` and `focusout` events (i.e. `focus` and `blur` that bubbles!)
    var _isFF = _browser.mozilla; // Firefox (as of version 3.0) doesn't support DOMFocus[In|Out]
                                   // so we resort to nasty capture events.  ...Run to the hills and expect the worst!!
    _RigUpDOMEventAsEventPlugin( 'focusin',  _isFF?'focus':'DOMFocusIn',   _isFF );
    _RigUpDOMEventAsEventPlugin( 'focusout', _isFF?'blur' :'DOMFocusOut',  _isFF );

  }


  var _fontresizeInterval,
      _body,
      _lastSize,
      _monitorFontSize = function(){
          var _spanSize = _body.css('fontSize');
          if (_spanSize != _lastSize)
          {
            _lastSize = _spanSize;
            $(window).trigger('fontresize');
          }
        };


  // define a custom event, window.onfontresize that fires whenever the document.body font-size changes.
  // TODO: allow binding to elements other than just window/body
  $.event.special.fontresize = {
    setup: function () {
        if (this == _win  || this == _doc.body) {
          _body = $('body');
          _lastSize = _body.css('fontSize');
          _fontresizeInterval = setInterval(_monitorFontSize, 500);
        }
      },
    teardown: function () {
        if (this == _win  ||  this == _doc.body) {
          clearTimeout( _fontresizeInterval );
        }
      }
  };





  // this method is part of jQuery 1.4
  $.fn.detach = $.fn.detach || function () {
      return this.each(function(){
          var parent = this.parentNode;
          parent  &&  parent.nodeType==1  &&  parent.removeChild(this);
        });
    };



  var findUntil = function(collection, expr, inclTextNodes, goBackwards) {
      var match = [],
          method = (goBackwards ? 'previous':'next')+'Sibling';
      collection.each(function(){
          for (var next = this[method], isElm; next; next = next[method] )
          {
            isElm = (next.nodeType == 1);
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


  $.fn.extend({

    // different from the built-in jQuery 1.4 methods, because it (optionally) also collects textNodes as well as Elements
    nextUntil: function(expr, inclTextNodes) { return findUntil(this, expr, inclTextNodes); },
    prevUntil: function(expr, inclTextNodes) { return findUntil(this, expr, inclTextNodes, 1); },


    // The method that officially does nothing! -
    // useful trick when you wish to conditionally do something in a chain... like
    //
    //     jQuery('div')
    //         .addClass('foo')
    //         [handler?'bind':null]('click', handler)
    //         .parent()
    //             ...etc...
    //
    'null': function () {  return this;  },


    if_: function (cond)
    {
      if ($.isFunction(cond)) { cond = cond.call(this); }
      this.if_CondMet = !!cond;
      return this.pushStack(cond ? this : []);
    },
    else_: function (cond)
    {
      var _this = this.end();
      return _this.if_CondMet ?
                  _this.pushStack([]):
                  _this.if_(arguments.length ? cond : 1);
    },

    // Clones the jQuery object and wipes out the it's `.prevObject` stack, and other instance-properties.
    // This allows the garbage collector to free up memory. (In some cases gobs of it!)
    fin: function(){ return $(this) },

    // collection should be .detached() for this to work properly
    shuffle: function (/* inline */) { // `inline` parameter not supported yet - will update the DOM position of the elements directly.
        var coll = this,
            l = coll.length;
        while (l) {
          var p = Math.floor( l * Math.random(l--) ),
              t = coll[l];
          coll[l] = coll[p];
          coll[p] = t;
        }
        return coll;
      },

    pause: function (speed, callback)
    {
      return callback||!$.fn.delay ?
                this.animate({ smu:0 }, (speed||speed===0)?speed:800, callback):
                this.delay(speed);
    },


    log: function ()
    {
      if (_win.console)
      {
        arguments.length && console.log.call(console, arguments);
        console.log(this);
      }
      return this;
    },


    // the reverse of $.fn.wrap()
    // only works if the target element is in the DOM.
    zap: function ()
    {
      return this.each(function(){
          this.parentNode  &&  $(this.childNodes).insertBefore(this);
        }).remove();
    },


    // Finds and returns a collection of the (first) deepest child element...
    // Useful when you want to emulate .wrap() and .wrapAll(), without cloning...
    deepest: function ()
    {
      return this.map(function(){
          var elem = this;
          while ( elem.firstChild )
          {
            elem = elem.firstChild;
          }
          return elem;
        });
    },



    hoverClass: function (hoverClass)
    {
      return this.hover(
                      function () { $(this).addClass(hoverClass); },
                      function () { $(this).removeClass(hoverClass); }
                    );
    },



    // Call any function as an "insta-plugin".
    run: function (func, argsArray, continueChain) // continueChain forces the plugin to return the collection instead of the return value of func
    {
      var ret = func.apply( this, argsArray||[] );
      return (continueChain || ret === undefined) ? this : ret;
    },


    // enforces DOM-ids on all items in the collection
    // and returns the id of the first item.
    aquireId: function (prefDefaultId)
    {
      return this.each(function() { $.aquireId(this, prefDefaultId); }).attr('id');
    },

    setFocus: function (rev)
    {
      this[0]  &&  $.setFocus.call(null, this[0], rev);
      return this;
    },


    // Yes this is strictly speaking completely redundant,
    // but jQuery's fn.scrollLeft and fn.scrollTop methods are so #$% inelegant to use.
    //
    // Usage:
    // collection.scroll();                    // returns { left:pageXOffset,  top:pageYOffset }
    // collection.scroll(xPos, yPos);          // scrolls to xPos, yPos
    // collection.scroll(xPos);                // scrolls to xPos - maintaining the current pageYOffset
    // collection.scroll(null, yPos);          // scrolls to yPos - maintaining the current pageXOffset
    // collection.scroll({ left:xPos, top:yPos });  // scrolls to xPos, yPos
    scroll: function (x, y)
    {
      if ( x == undefined  &&  y == undefined )
      {
        return { left:this.scrollLeft()  , top:this.scrollTop()  };
      }
      if ( x  &&  (x.top || x.left) )
      {
        y = x.top;
        x = x.left;
      }
      x!=undefined  &&  this.scrollLeft(x);
      y!=undefined  &&  this.scrollTop(y);
      return this;
    },


    toggleClasses: function(a, b, state)
    {
      return this.each(function(){
          var _elm = $(this),
              A = arguments.length>2 ? state : _elm.hasClass(a);
          _elm
              .removeClass(A? a : b)
              .addClass   (A? b : a);
        });
    },


    // returns the lang="" value of the first item in the collection
    lang: function (returnFull)
    {
      return $.lang(this[0], returnFull);
    }

  });



  $.extend({

    // prototypal inheritence under jquery
    beget: function (proto, props)
    {
      _F.prototype = proto;
      return props ? $.extend(new _F, props) : new _F;
    },


    // Usage examples:
    // jQuery.namespace('foo.bar.baz');             // finds/builds the object `foo.bar.baz`.
    // jQuery.namespace('foo.bar', { baz : 'value' });    // finds/builds the object `foo.bar`, after extending it with `{ baz : 'value' }`
    // jQuery.namespace('foo/bar/baz', null, '/');  // finds/builds the object `foo.bar.baz`.
    // jQuery.namespace(foo, 'bar.baz');            // finds/builds the object `foo.bar.baz`.
    //
    namespace: function (path, obj, splitter, _)
    {
      var base = _win,
          name, i = 0;
      if (typeof path != 'string')
      {
        // Assume first argument is a base object (to add the namespace to).
        // Shift all arguments to the right.
        base = path;
        path = obj;
        obj = splitter;
        splitter = _;
      }
      path = path.split(splitter || '.');
      while (name = path[i++])
      {
        base = base[name] || (base[name] = {});
      }
      return obj ? $.extend(base, obj) : base;
    },


    // Usage:
    // jQuery.aquireId();                         // returns a valid unique DOM id string that can be safely assigned to an element.
    // jQuery.aquireId(prefDefaultIdString);      // returns a valid unique DOM id based on `prefDefaultIdString` (appending/autoincrementing a trailing integer if needed)
    // jQuery.aquireId(elm);                      // returns the value of elm.id -- automatically assigning a unique id first, if needed.
    // jQuery.aquireId(elm, prefDefaultIdString); // returns the value of elm.id -- if needed automatically assigning a unique id based on `prefDefaultIdString`.
    //
    aquireId: function (el, prefDefaultId) // el is an optional parameter.
    {
      if (typeof el == 'string')
      {
        prefDefaultId = el;
        el = undefined;
      }
      el = $(el||[])[0]; // if `el` is a jQuery collection $.aquireId only uses the first item...
      if (!el || !el.id)
      {
        var id = prefDefaultId  ||  _guidPrefix + _guid++;
        if (prefDefaultId)
        {
          var m = prefDefaultId.match(/\d+$/),
              c = m ? parseInt(m[0],10) : 1;
          while ( $('#'+id)[0] )
          {
            if (m)
            {
              prefDefaultId = prefDefaultId.replace(/\d+$/, '');
              m = undefined;
            }
            id = prefDefaultId+(c++);
          }
        }
        if (!el) { return id; }
        if (!el.id) { el.id = id; }
      }
      return el.id;
    },

    

    // Turns `$.get`/`$.ajax` responseText HTML document source into a DOM tree, wrapped in a `<div/>` element for easy `.find()`ing
    // Stripping out all nasty `<script>`s and such things.
    getResultBody: function(responseText) {
        //return $('<body/>').append( // <-- this seems to cause crashes in IE8. (Note: Crash doesn't seem to happen on first run)
        return $('<div/>').append(
                    $(responseText||[])
                        .not('script,title,meta,link,style')
                            .find('script,style')
                                .remove()
                            .end()
                  );
      },



    // Finds and returns the language of an element - caching the results on the element itself.
    //
    // Usage:
    // jQuery.lang();          // returns the document language.
    // jQuery.lang(true);      // returns full document language code. e.g. "en-uk"
    // jQuery.lang(elm);       // returns the language of elm.
    // jQuery.lang(elm, true); // returns full language code of elm. e.g. "en-uk"
    // jQuery.lang( jQuery(elm) ); // returns the language of the *first* element in the jquery object/array.
    //
    lang: function (elm, returnFull)
    {
      returnFull = returnFull || elm === true  || elm === 1;
      var e = elm = (elm && ((elm.nodeName && elm) || (elm.jquery && elm[0])))  || _doc.documentElement; // default to checking the <html> element
      while (!e.lang && (e.tagName != "HTML")) { e = e.parentNode; }
      return  (e.lang) ? (elm.lang = e.lang).substr(0, (returnFull ? 99 : 2)).toLowerCase() : null;
    },


    // returns the .scroll() coordinates of $(document)
    scroll: function (x, y)
    {
      return $(_doc).scroll(x, y);
    },



    // sets the document.location.hash while suppressing the viewport scrolling
    // Accepts a plaintext fragment - and URI encodes it automatically - unless the `_isEncoded` flag is set.
    // Usage:
    //   jQuery.setFrag('myid');
    //   jQuery.setFrag('#myid');
    //   jQuery.setFrag('Fraîce 18%');
    //   jQuery.setFrag('Fra%C3%AEce%2018%25', true);
    //   jQuery.setFrag('');    // unset
    //   jQuery.setFrag(null);  // unset
    setFrag: function (_fragment, _isEncoded)
    {
      _fragment = (_fragment||'').replace(/^#/, '');
      // check if there exists an element with .id same as _fragment
      var _elm = _fragment  &&  _doc.getElementById(_fragment),
          _prePos = !_fragment  &&  $.scroll();
      if ( _elm )
      {
        // temporaily defuse the element's id
        _elm.id = '';
        // then insert and position a hidden dummy element to make sure that
        //   a) the hash-change populates the browser's history buffer.
        //   b) the viewport doesn't scroll/jump
        // (NOTE: This may be buggy in IE5 - but that's life)
        _dummyElm = _dummyElm || $('<i style="position:absolute;margin:0;visibility:hidden;" />');
        _dummyElm
            .attr('id', _fragment)
            .css('top', $.scroll().top)
            .appendTo(_doc.body);
      }
      //_location.hash = _fragment;  // set the damn hash...
      _location.href = _location.href.split("#")[0] +'#'+ (_isEncoded ? _fragment : $.encodeFrag(_fragment) );  // set the damn hash... (Note: Safari 3 & Chrome barf if frag === '#'.)
      if ( !_fragment )
      {
        $.scroll(_prePos);
      }
      if ( _elm )
      {
        _dummyElm[0].id = "";
        //_dummyElm.remove();
        // put the old tab-id back in it's place
        _elm.id = _fragment;
      }
    },

    // encodes a plain-text string to a URL #fragment friendly format (compatible with .getFrag())
    encodeFrag: function ( _fragment ) 
    {
      return encodeURI(_fragment).replace(/#/g, '%23').replace(/%7C/g, '|');
    },


    // returns the #fragment portion of `url` (defaulting to using `document.location.href`)
    // returns a plaintext (decodeURIComponent) version of the fragment - unless a `_returnRaw` argument is passed.
    getFrag: function (url, _returnRaw)
    {
      var _fragment = ( url || _location.href ).split('#')[1] || '';
      return _returnRaw ? _fragment : decodeURIComponent(_fragment);
    },


    // focus an _element (or it's first focusable _subElm)
    // (for screen-reader accessibility)
    setFocus: function (_elm, rev)
    {
      if (_elm)
      {
        _elm = $(_elm);
        var _focusables = ',A,INPUT,SELECT,TEXTAREA,BUTTON,OBJECT,AREA,',
            _focusElm = _focusables.indexOf(','+_elm[0].tagName+',')>-1  &&  _elm[0];

        if (!_focusElm)
        {
          var elms = $('*', _elm),
              i = rev ? elms.length : -1,
              incr = rev ? -1 : 1,
              elm;
          while (elm = elms[i+=incr])
          {
            if ( _focusables.indexOf(','+elm.tagName+',') > -1 )
            {
              _focusElm = elm;
              break;  // break the .each loop
            }
          }
        }
        if (_focusElm)
        {
          var $$ = $(_doc);
          // Make note of current scroll position
          var _before = $$.scrollTop();

          // Focus the element!
          $(_focusElm).trigger('focus');
          _msie  &&  $(_focusElm).trigger('focusin'); // OMFG!!!

          // make note of new scroll position
          var _after = $$.scrollTop();
          if (_after != _before)  // if the browser jumped to the anchor...  (the browser only scrolls the page if the _focusElm was outside the viewport)
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


/* Neato tabIndex trick (offered by AOL's accessibility plugin: http://dev.aol.com/axs) but doesn't work on Safari.. ack!

    // focus any _element
    // (for screen-reader accessibility)
    setFocus: function (_elm)
    {
      var _elm = $(_elm);
      if (!_elm.is('a,input,select,textarea,button,object,area')  &&  _elm.attr("tabIndex")==null) {
        _elm.attr("tabIndex", -1); // assign tabIndex value to allow focusing
      }
      // Make note of current scroll position
      var _before = $.scroll();
      // Put the focus inside the section
      // (the browser only scrolls the page if the _focusElm is outside the viewport)
      _elm[0].focus(); // <-- use element.focus() rather than $(element).trigger('focus'), because .trigger() doesn't trigger focusin event in MSIE
      // make note of new scroll position
      var _after = $.scroll();
      if (_after.top != _before.top)  // if the browser jumped to the anchor...
      {
        // ...then scroll the window to place the anchor at the top of the viewport.
        // (NOTE: We do this because most browsers place the artificially .focus()ed link at the *bottom* of the viewport.)
        $.scroll({  top: Math.max( $(_elm).offset().top - 30, 0 )  });
      }
    },
*/



    // For people who hate parseInt()
    // Usage:
    // $.toInt( '012.34m' )  == `12`
    //
    toInt: function (str, radix)
    {
      return parseInt(str, radix||10);
    },



/**
    // Convert queryString type String into a neat object.
    parseParams: function (paramString)
    {
      paramString = paramString || document.location.search;
      var params = paramString.split('?').reverse()[0].split('&'),
          i = params.length,
          map = {}, pair;
      while (i--)
      {
        pair = (params[i]||'').split('=');
        if (pair[0])
        {
          params[pair[0]] = pair[1];
        }
      }
      return map;
    },
/**/


    cropText: function (str, length, e)
    {
      e = e || '...';
      var newTxt = str = $.trim(str);
      if (length  &&  str.length >  length+e.length)
      {
        var hash = length +'~~'+e,
            cache = $.cropText.re || ($.cropText.re = {}),
            re = cache[hash] || (cache[hash] = new RegExp('^(.{0,'+length+'}\\s).{'+e.length+',}$'));
        newTxt = newTxt.replace(/\s+/g, ' ').replace(re, '$1');
      }
      return newTxt + (newTxt.length<str.length ? e : '');
    },



    // Simple String templating (variable injection) that accepts either arrays or hash-maps.
    // Usage:
    // $.inject('Hello %{1}! Hava a %{0}', ['banana', 'John']);                           // Returns  'Hello John! Have a banana'
    // $.inject('Hello %{name}! Hava a %{food}', { food : 'banana', person : 'John' });   // Returns  'Hello John! Have a banana'
    //
    inject: function(_theString, _vars)
    {
      var _keys = [],
          l = _vars.length,
          i;
      // fail early to save time
      if (_theString.indexOf('%{')>-1)
      {
        // NOTE: this is a fairly ugly way to collect the "keys" depending on if _vars is a List or an Object.
        if (isNaN(l)) { for (i in _vars)    { _keys.push(i); } }
        else          { while (l--) { _keys.push(l); } }
        // now loop through the _keys and perform the replacement
        i = _keys.length;
        while (i--)
        {
          var _key = _keys[i],
              re   = _injectRegExpCache[_key] || (_injectRegExpCache[_key] = new RegExp(_RegExpEscape('%{'+_key+'}'),'g')); // retieve the corresponding RegExp from the cache.
          _theString = _theString.replace(re, _vars[_key]);
        }
      }
      return _theString;
    }




  });

  $.setHash = $.setFrag;


})(jQuery);
