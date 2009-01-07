jQuery(function($){

  
  $.curtain = function (cfg, elm) {

      cfg = $.extend({
          className: 'curtain-overlay'
        },
        typeof(cfg)=='string' ?
            { className: cfg }:
        typeof(cfg)=='boolean'&&cfg ?
            { bgcol: '#888', opacity: .5 }:
            cfg
      );

      var _curtain = $(elm || '<div />')
              .remove()  // $('<div />').parent() will otherwise return an anomymous <div>.
                         // remove() allows us to optimize the window.onresize event below
              .addClass(cfg.className)
              .css({ position: 'absolute', top: 0, left: 0 })
              .hide()
              .bind('click', function(e){ e.stopPropagation(); return false; }),

          w = $(window),
          b = $(document.body),

          _resizeCurtain = function (e) {
              if ( _curtain.parent() )
              {
                var s = _curtain[0].style;
                if ($.browser.msie)
                {
                  s.width = s.height = '0'; // MSIE fix (version <= 7)
                }
                s.width  = Math.max( w.width(),  b.innerWidth() ) + 'px';
                s.height = Math.max( w.height(), b.innerHeight() ) + 'px';
              }
            };

      if (cfg.bgcol)
      {
        _curtain.css({ backgroundColor: cfg.bgcol, opacity: cfg.opacity  });
      }


      w.bind('resize', _resizeCurtain);
      $(_resizeCurtain);

      return _curtain;
    };


  $.fn.curtain = function (cfg) {
      return this.each(function(){  $.curtain(cfg, this);  });
    };


});