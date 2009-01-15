/*
  Requires:  jQuery 1.2 or 1.3

  Usage:

    jQuery.curtain();                // returns a basic curtain jQuery object ('<div class="curtain-overlay" />')
    jQuery.curtain(myElement);       // applies basic curtain behavior to myElement (and returns it).

    jQuery.curtain('myclassname');   // same as above, but replacing the default className with 'myclassname'
    jQuery.curtain(true);            // applies default color and opacity to the curtain element

    jQuery.curtain({                 // applies options to the curtain element.
        className: String,           //  * element class-name
        bgcol:     CssColorValue,    //  * inline CSS background-color value
        opacity:   Float [0...1],    //  * inline CSS opacity value
        z:         Integer           //  * inline CSS z-index value
      });


    jQuery('#mycurtain').curtain(options);  // applies basic curtain behavior to #mycurtain
                                            // (same options as for jQuery.curtain() above )
    jQuery.curtain(options, myElement);     // applies curtain behavior, with options, to myElement.


    jQuery('#mycurtain').curtain('destroy');   // removes the curtain and unbinds the window.onresize event handler.
    jQuery.curtain('destroy', myElement);      // removes the curtain and unbinds the window.onresize event handler.


*/

jQuery(function($){

  var curtain = $.curtain = function (cfg, elm) {

      if (cfg == 'destroy')
      {
        var _pos = $.inArray(elm, _curtainlist);
        if ( _pos > -1 )
        {
          $(elm).remove();
          _curtainlist.splice( _pos, 1 );
        }
        if (!_curtainlist.length)
        {
          w.unbind('resize', _resizeCurtains);
        }
        return;
      }


      if (cfg && (cfg.tagName || cfg.jquery))
      {
        elm = cfg;
        cfg = {};
      }

      cfg = $.extend({
          className: 'curtain-overlay'
        },
        typeof(cfg)=='string' ?
            { className: cfg }:
        typeof(cfg)=='boolean'&&cfg ?
            { bgcol: '#888', opacity: .5, z:99 }:
            cfg || {}
      );

      var _curtain = $(elm || '<div />')
              .remove()  // $('<div />').parent() will otherwise return an anomymous <div>.
                         // remove() allows us to optimize the window.onresize event below
              .addClass(cfg.className)
              .css({ position: 'absolute', top: 0, left: 0 })
              .hide()
              .bind('click', function(e){ e.stopPropagation(); return false; });

      _curtainlist.push(_curtain[0]);

      w.bind('resize', _resizeCurtains);
      _resizeCurtains('init');

      if ( cfg.bgcol || cfg.opacity || cfg.z )
      {
        _curtain.css({
            backgroundColor: cfg.bgcol,
            opacity: cfg.opacity,
            zIndex: cfg.z
          });
      }

      return _curtain;
    },

    _curtainlist = curtain.list = [],

    w = $(window),
    b = $(document.body),

    _resizeCurtains = function (e) {
        var i = _curtainlist.length,
            W = -1,
            H = W;

        while (i--)
        {
          var elm = _curtainlist[i];
          if ( elm  &&  (elm.parentNode || e == 'init') )
          {
            W = W!=-1 ? W : Math.max( w.width(),  b.innerWidth() );
            H = H!=-1 ? H : Math.max( w.height(), b.innerHeight() );
            var s = elm.style;
            if ($.browser.msie)
            {
              s.width = s.height = '0'; // MSIE fix (version <= 7)
            }
            s.width  = W+'px';
            s.height = H+'px';
          }
        }
      };


  $.fn.curtain = function (cfg) {
      return this.each(function(){  $.curtain(cfg, this);  });
    };


});
