// ----------------------------------------------------------------------------------
// jQuery.fn.curtain v 1.1
// ----------------------------------------------------------------------------------
// (c) 2010 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
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


  Requires:  jQuery 1.4

  Usage:

    jQuery.curtain();                // returns a basic curtain jQuery object ('<div class="curtain-overlay" />')
    jQuery.curtain(myCurtainElm);    // applies basic curtain behavior to myElement (and returns it).

    jQuery.curtain('myclassname');   // same as above, but replacing the default className with 'myclassname'
    jQuery.curtain(true);            // quick-n-dirty mode. applies some default color and opacity to the curtain element
                                     //     { bgcol: '#888', opacity: .5, zindex: 99 }

    jQuery.curtain({                  // applies options to the curtain element.
        fixed:     false              //  * Triggers `position:fixed` for curtain
        className: 'curtain-overlay', //  * CSS class-name
        bg:        null,              //  * inline CSS background-color value
        opacity:   null ,             //  * inline CSS opacity value (0-1)
        z:         null               //  * inline CSS z-index value
      });


    jQuery('#mycurtain').curtain(options);  // applies basic curtain behavior to #mycurtain
                                            // (same options as for jQuery.curtain() above )
    jQuery.curtain(options, myCurtainElm);  // applies curtain behavior, with options, to myElement.


    jQuery('#mycurtain').curtain('destroy');   // removes the curtain and unbinds the window.onresize event handler.
    jQuery.curtain('destroy', myCurtainElm);   // removes the curtain and unbinds the window.onresize event handler.


*/

(function($){
  var _strCurtain = 'curtain',
      _opacity = 'opacity',

      _curtainList = [],

      w = $(window),
      b,// = $('body');

      _resizeCurtains = function (e) {
          var list = !e ? [this] :  _curtainList,
              i = list.length,
              W,
              H = -1;

          while (i--)
          {
            var curtain = $( list[i] );
            if ( !curtain.data('is'+_strCurtain) )
            {
              $[_strCurtain]( 'destroy', curtain );
            }
            else if ( !e  ||  (curtain[0].parentNode  &&  curtain.is(':visible')) )
            {
              // only calculate window+body dimensions once per _resizeCurtain run, and only if _curtainList.length>0
              W = (H>-1) ? W : Math.max( w.width(),  b.innerWidth()  );
              H = (H>-1) ? H : Math.max( w.height(), b.innerHeight() );
              curtain
                  .css( 'width',  W )
                  .css( 'height', H );
            }
          }
        };



  $[_strCurtain] = function (cfg, elm) {

      if (cfg == 'destroy')
      {
        var _pos = $.inArray(elm, _curtainList);
        if ( _pos > -1 )
        {
          $(elm).remove();
          _curtainList.splice( _pos, 1 );
        }
        !_curtainList.length  &&  w.unbind('resize', _resizeCurtains);
        return;
      }


      if (cfg && (cfg.tagName || cfg.jquery))
      {
        elm = cfg;
        cfg = {};
      }

      cfg = $.extend({
            className: _strCurtain+'-overlay'
          },
          typeof(cfg)=='string' ?  // cfg == 'myCurtainClassName'  (Too much sugar!)
              { className: cfg }:
          (cfg && typeof(cfg)=='boolean') ? // cfg === true triggers "sensible defaults" mode  (Too much sugar!)
              { bg: '#888', opacity: .5, z:99 }:
              cfg || {}
        );
      var _curtain = $(elm || '<div />')
                          .hide()
                          .addClass( cfg.className )
                          .css({
                              position: cfg.fixed?'fixed':'absolute',
                              top: 0,
                              left: 0
                            });
      // for newly generated (or orphaned elements) auto-append it to document.body
      if (!elm || !elm.parentNode)
      {
        _curtain
            .appendTo( document.body );
      }

      if (cfg.fixed)
      {
        _curtain
            .css( 'width',  '100%' )
            .css( 'height', '100%' );
      }
      else
      {
        _curtainList.push( _curtain[0] );

        b = b || $('body'); // delayed assignment to save memory
        w.bind('resize', _resizeCurtains);
        _curtain
            .data('is'+_strCurtain, !0)
            .each(_resizeCurtains);
      }

      if ( cfg.bg || cfg[_opacity] || cfg.z )
      {
        _curtain.css({
            background: cfg.bg,
            opacity:    cfg[_opacity],
            zIndex:     cfg.z
          });
      }

      return _curtain;
    };


  $.fn[_strCurtain] = function (cfg) {
      return this.each(function(){  $[_strCurtain](cfg, this);  });
    };



})(jQuery);
