// ----------------------------------------------------------------------------------
// Simple mobile menu and stickyHeader behaviour  v 1.0
// ----------------------------------------------------------------------------------
// (c) 2014 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

(function($){
  var $win =  $(window);
  var $doc =  $(document);
  var $html = $('html');
  var openMenu;

  $.initMobileMenu = function (opts) {

      opts = $.extend({
                stickyHeader: true,
                mediaGroup:  'Small',
                name:        'menu',
                evPrefix:    'mobile',
                menuButton:  '.skiplink a',
              }, opts);

      var formatChangeEv = 'formatchange.' + opts.evPrefix + opts.name;
      var media = 'media' in opts ?  opts.media : ($.formatChange && $.formatChange.media);
      var isThisMenuOpen;

      var classPrefix = 'is-' + opts.name;
      var classClosed = classPrefix + '-closed';
      var classOpen =   classPrefix + '-open';
      var classActive = classPrefix + '-active';
      var eventPrefix = opts.evPrefix + opts.name;

      $win
          .on(formatChangeEv, function (/*e*/) {
              if ( !media  ||  media['became'+opts.mediaGroup] )
              {
                var scrollTopBeforeMenu;
                $html.addClass(classClosed);
                $(opts.menuButton)
                    .on('click.toggleMenu', function (e) {
                        var link = this;
                        e.preventDefault();
                        if ( !isThisMenuOpen )
                        {
                          openMenu  &&  $(openMenu).trigger('click.toggleMenu');
                          openMenu = link;
                          $doc.trigger( eventPrefix+'open' );
                          scrollTopBeforeMenu = $win.scrollTop() || 1;
                          $html.addClass(classOpen);
                          $html.removeClass(classClosed);
                          var target = $( $(link).attr('href') );
                          target.focusHere();
                          $win.scrollTop( 1 );
                          $doc.trigger( eventPrefix+'opened' );
                        }
                        else
                        {
                          openMenu = null;
                          $doc.trigger( eventPrefix+'close' );
                          $html.removeClass(classOpen);
                          $html.addClass(classClosed);
                          $win.scrollTop( scrollTopBeforeMenu );
                          link.blur();
                          $doc.trigger( eventPrefix+'closed' );
                        }
                        isThisMenuOpen = !isThisMenuOpen;
                      });
                !media && $win.off(formatChangeEv);
              }
              else if ( media['left'+opts.mediaGroup] )
              {
                // Close the menu when switching to Large formats
                if ( isThisMenuOpen )
                {
                  openMenu = null;
                  $doc.trigger( eventPrefix+'close' );
                  isThisMenuOpen = false;
                  $html.removeClass(classOpen);
                  $doc.trigger( eventPrefix+'closed' );
                }
                $(opts.menuButton).off('click.toggleMenu');
              }
            })
          .trigger(formatChangeEv);
      $html
          .addClass(classActive);

      // opts.stickyHeader  &&  $.initStickyHeader({
      //     media:        media
      //     upDelay:      upDelay,
      //     mediaGroup:   opts.mediaGroupp,
      //     headerHeight: opts.headerHeight,
      //   })
      opts.stickyHeader  &&  $.initStickyHeader( opts );

      return $;
    };




  $.initStickyHeader = function (opts) {

      opts = $.extend({
                upDelay:      50,
                mediaGroup:   'Small',
                headerHeight: function () { return parseInt($html.css('padding-top'), 10); },
              }, opts);

      var formatChangeEv = 'formatchange.stickyheader';
      var scrollEv = 'scroll.stickyheader';
      var media = 'media' in opts ?  opts.media : ($.formatChange && $.formatChange.media);

      // if ( typeof opts.headerHeight === 'number' )
      // {
      //   var height = opts.headerHeight;
      //   opts.headerHeight = function () { return height; };
      // }
      $win
          .on(formatChangeEv, function (/*e*/) {
              if ( !media  ||  media['became'+opts.mediaGroup] )
              {
                var lastOffs = 0;
                var headerHeight = opts.headerHeight();
                var hasPageYOffset = ('pageXOffset' in window);
                var isFixed = false;
                var isShown = false;

                $win
                    .on(scrollEv, $.throttleFn(function (/*e*/) {
                        if ( !openMenu )
                        {
                          var yOffs = hasPageYOffset ?
                                          window.pageYOffset:
                                          window.document.documentElement.scrollTop;
                          var doFix = yOffs > headerHeight;
                          if ( doFix !== isFixed )
                          {
                            $html.toggleClass('is-header-fixed', doFix);
                            if ( isFixed )
                            {
                              $html.removeClass('is-header-shown');
                              isShown = false;
                            }
                            lastOffs = yOffs;
                            isFixed = doFix;
                          }
                          if ( isFixed )
                          {
                            var delta = yOffs - lastOffs;
                            if ( delta > 0 )
                            {
                              if ( isShown )
                              {
                                $html.removeClass('is-header-shown');
                                isShown = false;
                              }
                              lastOffs = yOffs;
                            }
                            else if ( delta < -opts.upDelay )
                            {
                              if ( !isShown )
                              {
                                $html.addClass('is-header-shown');
                                isShown = true;
                              }
                              lastOffs = yOffs;
                            }
                          }
                        }
                      }, true, 50))
                    .trigger(scrollEv);
                !media  &&  $win.off(formatChangeEv);
              }
              else if ( media['left'+opts.mediaGroup] )
              {

                $win.off(scrollEv);
                $html.removeClass('is-header-fixed is-header-shown');

              }
            })
          .trigger(formatChangeEv);

      return $;
    };


})(jQuery);