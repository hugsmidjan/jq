// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.curtain v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

/*
  jQuery.fn.curtain (and jQuery.curtain)

  Applies basic curtain behaviour to an element. Tries to adhere to the "do less" principle. :-)
   * Default curtain styling:
     * Positioning: position: absolute;  top: 0;  left: 0;
     * Dimensions: width & height cover the whole <body> (or window) whichever is larger
     * Updates dimensions on window resize
   * optional:
     * position: fixed;  top: 0;  left: 0; width: 100%; height: 100%;
     * MSIE6 support: fall back to:  position: absolute;


  Requires:  jQuery 1.3

  Usage:

    jQuery.curtain();                // returns a basic curtain jQuery object ('<div class="curtain-overlay" />')
    jQuery.curtain(myCurtainElm);    // applies basic curtain behavior to myElement (and returns it).

    jQuery.curtain('myclassname');   // same as above, but replacing the default className with 'myclassname'
    jQuery.curtain(true);            // quick-n-dirty mode. applies some default color and opacity to the curtain element
                                     //     { bgcol: '#888', opacity: .5, zindex: 99 }

    jQuery.curtain({                 // applies options to the curtain element.
        fixed:     Boolean           //  * Triggers `position:fixed` for curtain // default: false
        className: String,           //  * CSS class-name                        // default: 'curtain-overlay'
        bg:        CssColorValue,    //  * inline CSS background-color value     // default: none
        opacity:   Float [0...1],    //  * inline CSS opacity value              // default: none
        z:         Integer           //  * inline CSS z-index value              // default: none
      });


    jQuery('#mycurtain').curtain(options);  // applies basic curtain behavior to #mycurtain
                                            // (same options as for jQuery.curtain() above )
    jQuery.curtain(options, myCurtainElm);  // applies curtain behavior, with options, to myElement.


    jQuery('#mycurtain').curtain('destroy');   // removes the curtain and unbinds the window.onresize event handler.
    jQuery.curtain('destroy', myCurtainElm);   // removes the curtain and unbinds the window.onresize event handler.


*/

(function($){

  var _curtain = 'curtain',
      _opacity = 'opacity',

      curtain = $[_curtain] = function (cfg, elm) {

          if (cfg == 'destroy')
          {
            var _pos = $.inArray(elm, _curtainlist);
            if ( _pos > -1 )
            {
              $(elm).remove();
              _curtainlist.splice( _pos, 1 );
            }
            !_curtainlist.length  &&  w.unbind('resize', _resizeCurtains);
            return;
          }


          if (cfg && (cfg.tagName || cfg.jquery))
          {
            elm = cfg;
            cfg = {};
          }

          cfg = $.extend({
                className: _curtain+'-overlay'
              },
              typeof(cfg)=='string' ?  // cfg == 'myCurtainClassName'
                  { className: cfg }:
              typeof(cfg)=='boolean'&&cfg ? // cfg === true triggers "sensible defaults" mode
                  { bg: '#888', opacity: .5, z:99 }:
                  cfg || {}
            );
          $.browser.msie  &&  parseInt($.browser.version, 10)<7 && (cfg.fixed = 0); // disable cfg.fixed in MSIE6

          var _curtain = $(elm || '<div />')
                              .hide()
                              .addClass( cfg.className )
                              .css({ position: cfg.fixed?'fixed':'absolute', top: 0, left: 0, width: '100%', height: '100%' });
          if (!elm || !elm.parentNode)
          {
            _curtain
                .appendTo( document.body );
          }
          if ( cfg.bg || cfg[_opacity] || cfg.z )
          {
            _curtain.css({
                background: cfg.bg,
                opacity:    cfg[_opacity],
                zIndex:     cfg.z
              });
          }

          if (!cfg.fixed)
          {
            // FIXME: remove this MSIE 7> hack as soon as jQuery 1.3.3 has been released (http://dev.jquery.com/ticket/3981)
            if ( cfg[_opacity]  &&  !$.support[_opacity] && _curtain.css(_opacity) == 1 ) {
              _curtain.css(_opacity, _curtain.css('filter').match(/opacity=(\d+)/) ? RegExp.$1/100 : 1);
            }
            _curtainlist.push(_curtain[0]);

            b = b || $('body'); // delayed assignment to save memory
            w.bind('resize', _resizeCurtains);
            _resizeCurtains(1);
          }

          return _curtain;
        };

  $.fn[_curtain] = function (cfg) {
      return this.each(function(){  $[_curtain](cfg, this);  });
    };


  var _curtainlist = curtain.list = [],

      w = $(window),
      b,// = $('body');

      _resizeCurtains = function (e) {
          var i = _curtainlist.length,
              W = -1,
              H = W;

          while (i--)
          {
            var elm = _curtainlist[i];
            if ( elm  &&  ( (elm.parentNode  &&  $(elm).is(':visible'))  ||  e == 1 ) )
            {
              // only calculate window+body dimensions once per _resizeCurtain run, and only if _curtainlist.length>0
              W = W!=-1 ? W : Math.max( w.width(),  b.innerWidth() );
              H = H!=-1 ? H : Math.max( w.height(), b.innerHeight() );
              var s = elm.style;
              s.width = s.height = '0'; // IE6 buggery workaround
              s.width  = W+'px';
              s.height = H+'px';
            }
          }
        };




})(jQuery);
