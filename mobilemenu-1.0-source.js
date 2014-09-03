/* jQuery MobileMenu and StickyHeader 1.0  -- (c) 2014 Hugsmiðjan ehf.  @preserve */

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
  var oldFormatChange = !window.FormatChange;
  var openMenu;

  $.initMobileMenu = function (opts) {

      opts = $.extend({
                stickyHeader: true,
                startOpen:    false,
                mediaGroup:  'Small', // String or `function (media, prefix) { return matches(media,prefix); }`
                name:        'menu',
                evPrefix:    'mobile',
                menuButton:  '.skiplink a',
              }, opts);

      var mediaGroup = (typeof opts.mediaGroup === 'function') ?
                          opts.mediaGroup:
                          function (media, prefix) { return !opts.mediaGroup || media[prefix+opts.mediaGroup]; };
      var formatChangeEv = 'formatchange.' + opts.evPrefix + opts.name;
      var isThisMenuOpen = opts.startOpen;

      var classPrefix = 'is-' + opts.name;
      var classClosed = classPrefix + '-closed';
      var classOpen =   classPrefix + '-open';
      var classActive = classPrefix + '-active';
      var eventPrefix = opts.evPrefix + opts.name;

      $win
          .on(formatChangeEv, function (e, media) {

              if ( mediaGroup(media,'became') )
              {
                var scrollTopBeforeMenu;
                $html.addClass( opts.startOpen ? classOpen : classClosed );
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
              else if ( mediaGroup(media,'left') )
              {
                // Close the menu when switching to Large formats
                if ( isThisMenuOpen )
                {
                  openMenu = null;
                  $doc.trigger( eventPrefix+'close' );
                  isThisMenuOpen = false;
                  $html.removeClass(classOpen +' '+ classClosed);
                  $doc.trigger( eventPrefix+'closed' );
                }
                $(opts.menuButton).off('click.toggleMenu');
              }
            });
      oldFormatChange  &&  $win.trigger(formatChangeEv, [$.formatChange.media]);
      $html
          .addClass(classActive);

      // opts.stickyHeader  &&  $.initStickyHeader({
      //     media:        media
      //     upDelay:      upDelay,
      //     mediaGroup:   opts.mediaGroupp,
      //     headerHeight: opts.headerHeight,
      //   })
      if ( opts.stickyHeader )
      {
        $.initStickyHeader( $.extend({}, opts, { name:'header' }) );
      }

      return $;
    };




  $.initStickyHeader = function (opts) {

      opts = $.extend({
                name:         'header',
                upDelay:      50,
                mediaGroup:  'Small', // String or `function (media) { return matches(media); }`
                headerHeight: function () { return parseInt($html.css('padding-top'), 10); },
              }, opts);

      var mediaGroup = (typeof opts.mediaGroup === 'function') ?
                          opts.mediaGroup:
                          function (media, prefix) { return !opts.mediaGroup || media[prefix+opts.mediaGroup]; };
      var formatChangeEv = 'formatchange.stickyheader';
      var scrollEv = 'scroll.stickyheader';

      var classPrefix = 'is-' + opts.name;
      var classFixed =  classPrefix + '-fixed';
      var classShown =  classPrefix + '-shown';

      // if ( typeof opts.headerHeight === 'number' )
      // {
      //   var height = opts.headerHeight;
      //   opts.headerHeight = function () { return height; };
      // }
      $win
          .on(formatChangeEv, function (e, media) {
              if ( mediaGroup(media,'became') )
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
                            $html.toggleClass( classFixed, doFix);
                            if ( isFixed )
                            {
                              $html.removeClass( classShown );
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
                                $html.removeClass( classShown );
                                isShown = false;
                              }
                              lastOffs = yOffs;
                            }
                            else if ( delta < -opts.upDelay )
                            {
                              if ( !isShown )
                              {
                                $html.addClass( classShown );
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
              else if ( mediaGroup(media,'left') )
              {

                $win.off(scrollEv);
                $html.removeClass( classFixed +' '+ classShown);

              }
            });
      oldFormatChange  &&  $win.trigger(formatChangeEv, [$.formatChange.media]);

      return $;
    };


})(jQuery);