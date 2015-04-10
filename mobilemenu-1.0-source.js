/* jQuery MobileMenu and StickyHeader 1.0  -- (c) 2014 Hugsmiðjan ehf.  @preserve */

// ----------------------------------------------------------------------------------
// Simple mobile menu and stickyHeader behaviour  v 1.0
// ----------------------------------------------------------------------------------
// (c) 2014-2015 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

// FIXME: Need to write documentation

(function(win){
  var $ = win.jQuery;


  // non-minimal mode legacy stuff
  var $win =  $(win);
  var currentlyOpenMenuWidget;
  var triggerOldFormatChangeEvent = function (formatChangeEv) {
          !win.FormatChange  &&  $win.trigger(formatChangeEv, [$.formatChange.media]);
        };
  // ------------------------------


  $.initMobileMenu = function (minimal, opts) {
      if ( minimal !== false  &&  minimal !== true )
      {
        opts = minimal;
        minimal = false;
      }

      opts = $.extend({
                // name:         'menu',
                // evPrefix:     'mobile',
                menuButton:   '.skiplink a',
                // startOpen:    false,
                // autoStart:    false,

                // container:    'html',
                // evTarget:     document,
                // scrollElm:    window,
                resetScroll:  true, // Boolean or Function

                minimal:      minimal // default: false
              }, opts);

      var name = opts.name || 'menu';
      var eventPrefix = (opts.evPrefix||'mobile')+name;
      var ns = '.toggle-'+eventPrefix;

      var classPrefix = 'is-'+name;
      var classClosed = classPrefix+'-closed';
      var classOpen =   classPrefix+'-open';
      var classActive = classPrefix+'-active';

      var isActive;// = false;
      var isOpen;// = false;


      var $evTarget; // lazy bound
      var $container; // lazy bound
      var $scrollElm; // lazy bound
      var $link; // lazy bound
      var $linkTarget; // lazy bound

      var resetScroll = opts.resetScroll.apply ? opts.resetScroll : function(){ return opts.resetScroll; };
      var scrollPosBeforeMenuOpened;

      var widget = {

              start: function () {
                  if ( !isActive )
                  {
                    // find the elements
                    if ( !$container )
                    {
                      $container = $( opts.container || 'html' );
                      $scrollElm = resetScroll()  &&  $( opts.scrollElm || win );
                      $evTarget = $( opts.evTarget || document );

                      if ( opts.menuButton )
                      {
                        $link = $(opts.menuButton);
                        $linkTarget = $.focusHere  &&  $link  &&  $link.attr('href');
                        $linkTarget = $linkTarget  &&  $( $linkTarget );
                      }
                    }

                    isActive = true;
                    isOpen = opts.startOpen;
                    $container
                        .addClass( isOpen ? classOpen : classClosed )
                        .addClass(classActive);
                    if ( $link )
                    {
                      $link
                          .on('click'+ns, function (e) {
                              e.preventDefault();
                              isOpen ?
                                  widget.close():
                                  widget.open();
                            });
                    }
                  }
                },

              open: function () {
                  if ( isActive && !isOpen )
                  {
                    $evTarget.trigger( eventPrefix+'open' );
                    scrollPosBeforeMenuOpened = resetScroll()  &&  $scrollElm.scrollTop();
                    $container
                        .addClass(classOpen)
                        .removeClass(classClosed);
                    $linkTarget  &&  $linkTarget.focusHere();
                    resetScroll()  &&  $scrollElm.scrollTop( 0 );
                    isOpen = true;
                    $evTarget.trigger( eventPrefix+'opened' );
                  }
                },

              close: function ( _isStopping ) {
                  if ( isActive && isOpen )
                  {
                    currentlyOpenMenuWidget = null;
                    $evTarget.trigger( eventPrefix+'close' );
                    $container
                        .removeClass(classOpen);
                    if ( !_isStopping )
                    {
                      $container
                          .addClass(classClosed);
                      resetScroll()  &&  $scrollElm.scrollTop( scrollPosBeforeMenuOpened );
                      $link  &&  $link[0].blur();
                    }
                    isOpen = false;
                    $evTarget.trigger( eventPrefix+'closed' );
                  }
                },

              stop: function () {
                  if ( isActive )
                  {
                    isActive = false;
                    widget.close(true);
                    $link.off('click'+ns);
                    $container.removeClass(classActive +' '+ classClosed);
                  }
                }
            };

      if ( opts.minimal )
      {
        opts.autoStart && widget.start();
      }
      else
      {
        // old fat behavior - handle formatChange and impose auto-toggling in-case of multiple widgets.

        // disallow customization to avoid this fat magic causing obscure side-effects
        opts.container = 'html';
        opts.scrollElm = win;
        opts.evTarget = document;

        var formatChangeEv = 'formatchange' + ns;
        var mediaGroupOptValue = ('mediaGroup' in opts) ? opts.mediaGroup : 'Small';
        var mediaGroup = (typeof mediaGroupOptValue === 'function') ?
                            mediaGroupOptValue:
                            function (media, prefix) { return !mediaGroupOptValue || media[prefix+mediaGroupOptValue]; };
        $win
            .on(formatChangeEv, function (e, media) {
                if ( !isActive && mediaGroup(media,'became') )
                {
                  widget.start();
                  $evTarget
                      .on( eventPrefix+'open'+ns, function () {
                          currentlyOpenMenuWidget  &&  currentlyOpenMenuWidget.close();
                          currentlyOpenMenuWidget = widget;
                        })
                      .on( eventPrefix+'closed'+ns, function () {
                          currentlyOpenMenuWidget = null;
                        });
                  !mediaGroupOptValue && $win.off(formatChangeEv);
                }
                else if ( isActive && mediaGroup(media,'left') )
                {
                  widget.stop();
                  $evTarget.off( ns );
                }
              });
        triggerOldFormatChangeEvent( formatChangeEv );

        if ( opts.stickyHeader !== false )
        {
          widget.stickyHeaderWidget = $.initStickyHeader( $.extend({}, opts, { name:'header' }) );
        }
        return $;
      }


      return widget;
    };






  // =============================================================================






  $.initStickyHeader = function (minimal, opts) {
      if ( minimal !== false  &&  minimal !== true )
      {
        opts = minimal;
        minimal = false;
      }

      opts = $.extend({
                // headerHeight: function () { return parseInt($container.css('padding-top'), 10); },
                delay:        50,
                recede:     true, // Boolean or Function
                                  // monitor up/down movement to hide/show if up/down limits are exceeded
                upLimit:      70,
                downLimit:    50,
                // name: 'header',
                // onresize:  false,
                // autoStart: false,

                // container:    'html',
                // scrollElm:    window,

                minimal:      minimal // default: false
              }, opts);

      var name = opts.name || 'header';
      var ns = '.sticky-'+name;
      var scrollEv = 'scroll'+ns;
      var scrollAndResizeEv = scrollEv + (opts.onresize ? ' resize'+ns : '');

      var classPrefix = 'is-'+name;
      var classFixed =  classPrefix+'-fixed';
      var classHidden = classPrefix+'-hidden';
      var classShown =  classPrefix+'-shown';

      var isActive = false;

      var $container; // lazy bound
      var $scrollElm; // lazy bound

      var widget = {

              upLimit: opts.upLimit,
              downLimit: opts.downLimit,
              recede: opts.recede.apply ? opts.recede : function(){ return opts.recede; },

              // distY: 0
              // isFixed: (distY > 0),
              // isShown: false,

              headerHeight: opts.headerHeight || function () { return parseInt($container.css('padding-top'), 10); },

              start: function () {
                  if ( !isActive )
                  {
                    isActive = true;
                    var lastOffs = 0;
                    var updateLastOffset;
                    var hasPageYOffset = ('pageXOffset' in win);
                    var isFixed = false;
                    var isShown = false;
                    var delay = opts.delay;

                    var monitorScroll = function (/*e*/) {
                            if ( !currentlyOpenMenuWidget )
                            {
                              var yOffs = hasPageYOffset ?
                                              win.pageYOffset:
                                              document.documentElement.scrollTop;
                              var distY = widget.distY = yOffs - widget.headerHeight();
                              var doFix = distY > 0;
                              updateLastOffset  &&  clearTimeout( updateLastOffset );

                              if ( doFix !== isFixed )
                              {
                                isFixed = doFix;
                                lastOffs = yOffs;
                                $container.toggleClass( classFixed +' '+ classHidden , isFixed);
                                if ( !isFixed )
                                {
                                  $container
                                      .removeClass( classShown );
                                  isShown = false;
                                }
                              }
                              if ( widget.recede() && isFixed )
                              {
                                var delta = yOffs - lastOffs;
                                var exceededLimit;
                                if ( (exceededLimit = delta > widget.downLimit) ) // going down
                                {
                                  if ( isShown )
                                  {
                                    $container
                                        .removeClass( classShown )
                                        .addClass( classHidden );
                                    isShown = false;
                                  }
                                }
                                else if ( (exceededLimit = delta < -widget.upLimit) ) // going up
                                {
                                  if ( !isShown )
                                  {
                                    $container
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
                              widget.isFixed = doFix;
                              widget.isShown = isShown;
                            }
                          };

                    $container = $container || $(opts.container || 'html' );
                    $scrollElm = $scrollElm || $( opts.scrollElm || win );

                    $scrollElm
                        .on(scrollAndResizeEv, (delay && $.throttleFn) ?
                                $.throttleFn(monitorScroll, true, delay):
                                monitorScroll)
                        .trigger(scrollEv);
                  }
                },
              stop: function () {
                  if ( isActive )
                  {
                    isActive = false;
                    $scrollElm.off( scrollAndResizeEv );
                    $container.removeClass( classFixed+' '+classShown+' '+classHidden );
                  }
                }

            };


      if ( opts.minimal )
      {
        opts.autoStart  &&  widget.start();
      }
      else
      {
        opts.container = 'html';
        opts.scrollElm = win;

        // old fat behavior - handle formatChange.
        var formatChangeEv = 'formatchange'+ns;
        var mediaGroupOptValue = ('mediaGroup' in opts) ? opts.mediaGroup : 'Small';
        var mediaGroup = (typeof mediaGroupOptValue === 'function') ?
                            mediaGroupOptValue:
                            function (media, prefix) { return !mediaGroupOptValue || media[prefix+mediaGroupOptValue]; };
        $win
            .on(formatChangeEv, function (e, media) {
                if ( !isActive && mediaGroup(media,'became') )
                {
                  widget.start();
                  !mediaGroupOptValue  &&  $win.off(formatChangeEv);
                }
                else if ( isActive && mediaGroup(media,'left') )
                {
                  widget.stop();
                }
              });
        triggerOldFormatChangeEvent( formatChangeEv );
        return $;
      }

      return widget;
    };


})(window);