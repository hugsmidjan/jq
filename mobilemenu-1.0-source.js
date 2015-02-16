/* jQuery MobileMenu and StickyHeader 1.0  -- (c) 2014 Hugsmiðjan ehf.  @preserve */

// ----------------------------------------------------------------------------------
// Simple mobile menu and stickyHeader behaviour  v 1.0
// ----------------------------------------------------------------------------------
// (c) 2014-2015 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

(function(win){
  var $ = win.jQuery;
  var $win =  $(win);
  var $doc =  $(document);
  var $html = $('html');

  var triggerOldFormatChangeEvent = function (formatChangeEv) {
          !win.FormatChange  &&  $win.trigger(formatChangeEv, [$.formatChange.media]);
        };
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
      var mediaGroupOptValue = opts.mediaGroup;
      var mediaGroup = (typeof mediaGroupOptValue === 'function') ?
                          mediaGroupOptValue:
                          function (media, prefix) { return !mediaGroupOptValue || media[prefix+mediaGroupOptValue]; };
      var formatChangeEv = 'formatchange.' + opts.evPrefix + opts.name;
      var isThisMenuOpen = opts.startOpen;

      var classPrefix = 'is-' + opts.name;
      var classClosed = classPrefix + '-closed';
      var classOpen =   classPrefix + '-open';
      var classActive = classPrefix + '-active';
      var eventPrefix = opts.evPrefix + opts.name;

      var isActive = false;

      $win
          .on(formatChangeEv, function (e, media) {


              if ( !isActive && mediaGroup(media,'became') )
              {
                isActive = !isActive;
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
                          $html
                              .addClass(classOpen)
                              .removeClass(classClosed);
                          $( $(link).attr('href') )
                              .focusHere();
                          $win.scrollTop( 1 );
                          $doc.trigger( eventPrefix+'opened' );
                        }
                        else
                        {
                          openMenu = null;
                          $doc.trigger( eventPrefix+'close' );
                          $html
                              .removeClass(classOpen)
                              .addClass(classClosed);
                          $win.scrollTop( scrollTopBeforeMenu );
                          link.blur();
                          $doc.trigger( eventPrefix+'closed' );
                        }
                        isThisMenuOpen = !isThisMenuOpen;
                      });
                !mediaGroupOptValue && $win.off(formatChangeEv);
                $html
                    .addClass(classActive);
              }
              else if ( isActive && mediaGroup(media,'left') )
              {
                isActive = !isActive;
                // Close the menu when switching to Large formats
                if ( isThisMenuOpen )
                {
                  openMenu = null;
                  $doc.trigger( eventPrefix+'close' );
                  isThisMenuOpen = false;
                  $doc.trigger( eventPrefix+'closed' );
                }
                $(opts.menuButton).off('click.toggleMenu');
                $html.removeClass(classActive +' '+ classOpen +' '+ classClosed);
              }
            });
      triggerOldFormatChangeEvent( formatChangeEv );

      // opts.stickyHeader  &&  $.initStickyHeader({
      //     media:        media
      //     upLimit:      upLimit,
      //     downLimit:    downLimit,
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
                upLimit:      70,
                downLimit:    50,
                //onresize:  false,
                mediaGroup:  'Small', // String or `function (media, prefix) { return matches(media, prefix); }`
                headerHeight: function () { return parseInt($html.css('padding-top'), 10); },
              }, opts);
      var mediaGroupOptValue = opts.mediaGroup;
      var mediaGroup = (typeof mediaGroupOptValue === 'function') ?
                          mediaGroupOptValue:
                          function (media, prefix) { return !mediaGroupOptValue || media[prefix+mediaGroupOptValue]; };
      var ns = '.stickyheader';
      var formatChangeEv = 'formatchange'+ns;
      var scrollEv = 'scroll'+ns;
      var scrollAndResizeEv = scrollEv + (opts.onresize ? ' resize'+ns : '');

      var classPrefix = 'is-' + opts.name;
      var classFixed =  classPrefix + '-fixed';
      var classHidden = classPrefix + '-hidden';
      var classShown =  classPrefix + '-shown';

      var isActive = false;

      // if ( typeof opts.headerHeight === 'number' )
      // {
      //   var height = opts.headerHeight;
      //   opts.headerHeight = function () { return height; };
      // }
      $win
          .on(formatChangeEv, function (e, media) {
              if ( !isActive && mediaGroup(media,'became') )
              {
                isActive = !isActive;
                var lastOffs = 0;
                var updateLastOffset;
                var hasPageYOffset = ('pageXOffset' in win);
                var isFixed = false;
                var isShown = false;

                $win
                    .on(scrollAndResizeEv, $.throttleFn(function (/*e*/) {
                        if ( !openMenu )
                        {
                          var yOffs = hasPageYOffset ?
                                          win.pageYOffset:
                                          document.documentElement.scrollTop;
                          var doFix = yOffs > opts.headerHeight();
                          updateLastOffset  &&  clearTimeout( updateLastOffset );

                          if ( doFix !== isFixed )
                          {
                            isFixed = doFix;
                            lastOffs = yOffs;
                            $html.toggleClass( classFixed +' '+ classHidden , isFixed);
                            if ( !isFixed )
                            {
                              $html
                                  .removeClass( classShown );
                              isShown = false;
                            }
                          }
                          if ( isFixed )
                          {
                            var delta = yOffs - lastOffs;
                            var exceededLimit;
                            if ( (exceededLimit = delta > opts.downLimit) ) // going down
                            {
                              if ( isShown )
                              {
                                $html
                                    .removeClass( classShown )
                                    .addClass( classHidden );
                                isShown = false;
                              }
                            }
                            else if ( (exceededLimit = delta < -opts.upLimit) ) // going up
                            {
                              if ( !isShown )
                              {
                                $html
                                    .removeClass( classHidden )
                                    .addClass( classShown );
                                isShown = true;
                              }
                            }
                            if ( exceededLimit )
                            {
                              lastOffs = yOffs;
                            }
                            else
                            {
                              updateLastOffset = setTimeout(function(){
                                  lastOffs = yOffs;
                                }, 1000);
                            }
                          }
                        }
                      }, true, 50))
                    .trigger(scrollEv);
                !mediaGroupOptValue  &&  $win.off(formatChangeEv);
              }
              else if ( isActive && mediaGroup(media,'left') )
              {
                isActive = !isActive;
                $win.off(scrollAndResizeEv);
                $html.removeClass( classFixed +' '+ classShown);

              }
            });
      triggerOldFormatChangeEvent( formatChangeEv );

      return $;
    };


})(window);