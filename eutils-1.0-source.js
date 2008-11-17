(function($){

/*
 TODO:

  * $.fn.outerHTML
  * $.outerHTML
??
  bind
  bindAfter
  viewportSize
  docSize

*/

  var _dummyElm,  // dummy element used by $.setHash();
      _win = window,
      _doc = document,
      R = RegExp,

      // suffix and prefix used to generate temporary @id-values for HTMLelements without an @id
      _guidPrefix = 'tmp_' + (new Date()).getTime() + '_',

      // a counter that should be incremented with each use.
      _guid = 1,

      _injectRegExpCache = {}; // used by $.inject(); to store regexp objects.




  // The :childof() and :descof() selector expressions make .is(), .parents() 
  // and other such methods sooo much more interesting...!
  // these work wonders when combined with $.delegate() (see below)
  // Example:
  $.extend($.expr[':'], {

    childof: function (a, i, m) {
      return $(a.parentNode).is(m[3]);
    },

    descof: function (a, i, m) {
      while ((a = a.parentNode)  &&  a !== document) {
        if ($(a).is(m[3])) {
          return true;
        }
      }
      return false;
    }

  });



  $.fn.extend({

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


    pause: function (speed, callback)
    {
      return this.animate({ smu:0 }, speed||800, callback);
    },


    // run a function once.
    // (similar to .each(function) that always returns false - except that inside the function this == the jQuery collection.)
    run: function (func, args)
    {
      func.apply(this, args);
      return this;
    },

    // assigns/enforces an id on all items in the collection
    aquireId: function ()
    {
      return this.each(function() { $.aquireId(this); });
    },

    setFocus: function ()
    {
      $.outerHTML(this[0]);
      return this;
    },


    delegate: function(subselector, type, handler, data)
    {
      return this.bind(type, data, $.delegate(subselector, handler));
    },


    toggleClasses: function(a, b)
    {
      return this.each(function(){
          var _elm = $(this),
              A = _elm.hasClass(a);
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
    beget : function (proto, props)
    {
      var F = function () {};
      F.prototype = proto;
      var instance = new F();
      return props ? $.extend(instance,props) : instance;
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
    // jQuery.aquireId();    // returns a valid unique DOM id string that can be safely assigned to an element.
    // jQuery.aquireId(elm); // returns the value of elm.id -- automatically assigning a unique id first, if needed.
    //
    aquireId: function (el) // el is an optional parameter.
    {
      if (!el || !el.id)
      {
        var id = _guidPrefix + _guid++;
        if (!el) { return id; }
        if (!el.id) { el.id = id; }
      }
      return el.id;
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
      returnFull = returnFull || (elm === true  || elm === 1);
      var e = elm = (elm && (elm.nodeName && elm) || (elm.jquery && elm[0]))  || _doc.documentElement; // default to checking the <html> element
      while (!e.lang && (e.tagName != "HTML")) { e = e.parentNode; }
      return  (e.lang) ? (elm.lang = e.lang).substr(0, (returnFull ? 99 : 2)).toLowerCase() : null;
    },



    // Yes this is strictly speaking completely redundant, 
    // but jQuery's fn.scrollLeft and fn.scrollTop methods are so #$% inelegant to use.
    //
    // Usage:
    // $.scroll();                    // returns { left:pageXOffset,  top:pageYOffset }
    // $.scroll(xPos, yPos);          // scrolls to xPos, yPos
    // $.scroll(xPos);                // scrolls to xPos - maintaining the current pageYOffset
    // $.scroll(null, yPos);          // scrolls to yPos - maintaining the current pageXOffset
    // $.scroll({ left:xPos, top:yPos });  // scrolls to xPos, yPos
    scroll: function (x, y)
    {
      if (!arguments.length)
      {
        if ($.browser.msie)
        {
          var d = _doc.documentElement;  // default to IE6 strict
          if (!d || !d.scrollTop) { d = _doc.body; }  // fallback for other values of IE
          x = d.scrollLeft;
          y = d.scrollTop;
        }
        else
        {
          x = _win.pageXOffset;
          y = _win.pageYOffset;
        }
        return { left:x, top:y };
      }
      else
      {
        if (y === undefined  &&  typeof x !== 'number')  // x is an x,y object
        {
          x = x.left;
          y = x.top;
        }
        x = (typeof x == 'number') ? x : $.scroll().left;
        y = (typeof y == 'number') ? y : $.scroll().top;
        _win.scrollTo(x, y);
      }
    },




    // sets the document.location.hash while suppressing the viewport scrolling
    // Usage:
    //   jQuery.setHash('myid');
    //   jQuery.setHash('#myid');
    setHash: function (_hash)
    {
      _hash = _hash.replace(/^#/, '');
      var _elm = $('#'+_hash);
      if (_elm)
      {
        // temporaily defuse the section block's id 
        _elm.id = '';
        // then insert and position a hidden dummy element to make sure that
        //   a) the hash-change populates the browser's history buffer.
        //   b) the viewport doesn't scroll/jump
        // (NOTE: This may be buggy in IE5 - but that's life)
        _dummyElm = _dummyElm || $('<i style="position:absolute;visibility:hidden;"></i>')[0];
        _dummyElm.id = _hash;
        $(_dummyElm)
            .appendTo(_doc.body)
            .css('top', $.scroll().top+'px');
      }
      document.location.hash = _hash;  // set the damn hash...
      if (_elm)
      {
        $(_dummyElm).remove();
        // put the old tab-id back in it's place
        _elm.id = _hash;
      }
    },


    // focus an _element (or it's first focusable _subElm) 
    // (for screen-reader accessibility)
    setFocus: function (_elm)
    {
      _elm = $(_elm);
      var _focusElm = _elm[0];
      if (!_focusElm.focus)
      {
        $('*', _elm)
            .each(function()
              {
                if (this.focus)
                {
                  _focusElm = this;
                  return false;  // break the .each loop
                }
              });
      }
      if (_focusElm.focus)
      {
        var _before = $.scroll();

        // emulate the click action - putting the focus inside the section
        // (the browser only scrolls the page if the _focusElm is outside the viewport)
        _focusElm.focus();

        var _after = $.scroll();
        if (_after.top != _before.top)  // if the browser jumped to the anchor...
        {
          // then scroll the window to place the anchor at the top of the viewport.
          // (NOTE: We do this because most browsers place the artificially .focus()ed link at the bottom of the viewport.)
          var _newTop = $(_elm).offset().top - 30;
          if (_newTop < 10) { _newTop = 0; }
          $.scroll({ top: _newTop });
        }
      }
    },



    // For people who hate parseInt()
    // Usage:
    // $.toInt( '012.34m' )  == `12`
    //
    toInt: function (str, radix)
    {
      return parseInt(str, radix||10);
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
      if (this.indexOf('%{')>-1)
      {
        // NOTE: this is a fairly ugly way to collect the "keys" depending on if _vars is a List or an Object.
        if (isNaN(l)) { for (i in _vars)    { _keys.push(i); } }
        else          { while (l--) { _keys.push(l); } }
        // now loop through the _keys and perform the replacement
        i = _keys.length;
        while (i--)
        {
          var _key = _keys[i],
              re   = _injectRegExpCache[_key] || (_injectRegExpCache[_key] = new R(R.escape('%{'+_key+'}'),'g')); // retieve the corresponding RegExp from the cache.
          _theString = _theString.replace(re, _vars[_key]);
        }
      }
      return _theString;
    },



    // Transforms normal selectors into "reversed" ones
    // (Super useful for event delegation and passing user-defined selectors into `.is()` and `.parents()`):
    //   * 'p a'        -->  'a:descof(p)'
    //   * 'p > a'      -->  'a:childof(p)'
    //   * 'div p > a'  -->  'a:childof(p:descof(div))'
    //
    // Note: We're not handling 'a ~ span' or 'a + span'  - at least for now
    //
    invSelectors: function (selector)
    {
      selector = $.trim(selector)
                  .replace(/  +/, ' ')
                  .replace(/ ?> ?/g, '>')
                  .replace(/ \)/g, ')')
                  .replace(/\( /g, '(');
      var _selectors = [];
      $.each(selector.split(/ ?, ?/), function(j, _sel){
        var _newSel = '',
            i=0;
        _sel = _sel.replace(/^>/g, '');
        while (_sel = _sel.replace(/(^| |>)([^ >]*)$/, function(all, p1, p2){
            _newSel += p2 + ((p1==' ') ? ':descof(' : (p1=='>') ? ':childof(' : '');
            i++;
            return '';
          })
        ) {}

        _selectors[j] = _newSel + (new Array(i)).join(')');
      });
      return _selectors.join(',');
    },



    delegate: function (selector, handler)
    {
      selector = $.invSelectors(selector);
/*
      var _isSimpleSelector = !/ /.test( selector );
*/

      return function (event) {
        var _target = $(event.target),
            _allParents = _target.add(_target.parents()), // include the event target itself.
            _elm = _allParents.slice(0, _allParents.index(this)).filter(selector)[0];
/*
            _parents = _allParents.slice(0, $.inArray(this, _allParents)),
            _elm;

        if (_isSimpleSelector)
        {
          _elm = _parents.filter(selector)[0];
        }
        else // Warning complex selectors (such as 'p > a.foo span') do not scale AT ALL for a large DOM tree.
        {
          // eeek! inefficient!
          var _allElms = $(selector, this),
              i = _allElms.length;
          // loop backwars to find the innermost matching element
          while (i--)
          {
            if ( _elm = _parents[_parents.index(_allElms[i])] )
            {
              break;
            } 
          }
        }
*/

        if (_elm)
        {
          event.delegate = _elm;
          return handler.call(this, event);
        }

      }
    }






  });



})(jQuery);