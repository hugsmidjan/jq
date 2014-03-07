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
  var isMenuOpen;

  $.initMobileMenu = function (opts) {

      opts = $.extend({
                stickyHeader: true,
                mediaGroup:  'Small',
                menuButton:  '.skiplink a',
              }, opts);

      var formatChangeEv = 'formatchange.mobileMenu';
      var media = 'media' in opts ?  opts.media : ($.formatChange && $.formatChange.media);

      $win
          .on(formatChangeEv, function (/*e*/) {
              if ( !media  ||  media['became'+opts.mediaGroup] )
              {
                var scrollTopBeforeMenu;
                $html.addClass('is-menu-closed');
                $(opts.menuButton)
                    .on('click.toggleMenu', function (e) {
                        e.preventDefault();
                        if ( !isMenuOpen )
                        {
                          scrollTopBeforeMenu = $win.scrollTop() || 1;
                          $html.addClass('is-menu-open');
                          $html.removeClass('is-menu-closed');
                          var target = $( $(this).attr('href') );
                          target.focusHere();
                          $win.scrollTop( 1 );
                          $doc.trigger('mobilemenuopened');
                        }
                        else
                        {
                          $html.removeClass('is-menu-open');
                          $html.addClass('is-menu-closed');
                          $win.scrollTop( scrollTopBeforeMenu );
                          this.blur();
                          $doc.trigger('mobilemenuclosed');
                        }
                        isMenuOpen = !isMenuOpen;
                      });
                !media && $win.off(formatChangeEv);
              }
              else if ( media['left'+opts.mediaGroup] )
              {
                // Close the menu when switching to Large formats
                if ( isMenuOpen )
                {
                  isMenuOpen = false;
                  $html.removeClass('is-menu-open');
                  $doc.trigger('mobilemenuclosed');
                }
                $(opts.menuButton).off('click.toggleMenu');
              }
            })
          .trigger(formatChangeEv);
      $html
          .addClass('is-menu-active');

      // opts.stickyHeader  &&  $.initStickyHeader({
      //     media:        media
      //     upDelay:      upDelay,
      //     mediaGroup:   opts.mediaGroupp,
      //     headerHeight: opts.headerHeight,
      //   })
      opts.stickyHeader  &&  $.initStickyHeader( opts );

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
                        if ( !isMenuOpen )
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
    };


})(jQuery);