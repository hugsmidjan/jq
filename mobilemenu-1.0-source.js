/* jQuery MobileMenu and StickyHeader 1.0  -- (c) 2014-2016 Hugsmiðjan ehf.  @preserve */

// ----------------------------------------------------------------------------------
// Simple mobile menu and stickyHeader behaviour  v 1.0
// ----------------------------------------------------------------------------------
// (c) 2014-2016 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
// ----------------------------------------------------------------------------------

// FIXME: Need to write documentation

(function(win){
  var $ = win.jQuery;


  // non-minimal mode legacy stuff
  var $win =  $(win);
  var triggerOldFormatChangeEvent = function (formatChangeEv) {
          !win.FormatChange  &&  $win.trigger(formatChangeEv, [($.formatChange||{}).media]);
        };
  // ------------------------------


  $.initMobileMenu = function (opts) {
      opts = opts===true ? { minimal:true } : opts;
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

                // minimal: false,
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
      var containerClassList; // lazy bound
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
                    if ( !containerClassList )
                    {
                      containerClassList = ($(opts.container)[0] || document.documentElement).classList;
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
                    containerClassList.add( classActive )
                    containerClassList.add( isOpen ? classOpen : classClosed )
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
                    containerClassList.add(classOpen);
                    containerClassList.remove(classClosed);
                    $linkTarget  &&  $linkTarget.focusHere();
                    resetScroll()  &&  $scrollElm.scrollTop( 0 );
                    isOpen = true;
                    $evTarget.trigger( eventPrefix+'opened' );
                  }
                },

              close: function ( _isStopping ) {
                  if ( isActive && isOpen )
                  {
                    $evTarget.trigger( eventPrefix+'close' );
                    containerClassList.remove(classOpen);
                    containerClassList.add(classClosed);
                    if ( !_isStopping )
                    {
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
                    widget.close(true);
                    $link.off('click'+ns);
                    containerClassList.remove(classActive);
                    containerClassList.remove(classClosed);
                    isActive = false;
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

        // disallow certain customization to avoid this fat magic causing obscure side-effects
        opts.container = 'html';
        opts.scrollElm = win;
        opts.evTarget = document;

        var currentlyOpenMenuWidget;
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
      }


      return widget;
    };






  // =============================================================================






  $.initStickyHeader = function (opts) {
      opts = opts===true ? { minimal:true } : opts;
      opts = $.extend({
                // headerHeight: function () { return parseInt(getComputedStyle(container).paddingTop, 10); },
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

                // minimal: false,
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
      var isPaused = false;

      var container; // lazy bound
      var containerClassList; // lazy bound
      var $scrollElm; // lazy bound

      var widget = {

              upLimit: opts.upLimit,
              downLimit: opts.downLimit,
              recede: opts.recede.apply ? opts.recede : function(){ return opts.recede; },

              // distY: 0
              // isFixed: (distY > 0),
              // isShown: false,

              headerHeight: opts.headerHeight || function () { return parseInt(getComputedStyle(container).paddingTop, 10); },

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
                            if ( !isPaused )
                            {
                              var yOffs = hasPageYOffset ?
                                              win.pageYOffset:
                                              document.documentElement.scrollTop;
                              widget.distY = yOffs;
                              var doFix = yOffs > (isFixed ? 0 : widget.headerHeight());
                              clearTimeout( updateLastOffset );

                              if ( doFix !== isFixed )
                              {
                                isFixed = doFix;
                                lastOffs = yOffs;
                                containerClassList[isFixed?'add':'remove']( classFixed );
                                if ( !isFixed )
                                {
                                  containerClassList.remove( classShown );
                                  containerClassList.remove( classHidden );
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
                                    containerClassList.remove( classShown )
                                    containerClassList.add( classHidden );
                                    isShown = false;
                                  }
                                }
                                else if ( (exceededLimit = delta < -widget.upLimit) ) // going up
                                {
                                  if ( !isShown )
                                  {
                                    containerClassList.remove( classHidden )
                                    containerClassList.add( classShown );
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
                              widget.isFixed = isFixed;
                              widget.isShown = isShown;
                            }
                          };

                    container = container || $(opts.container)[0] || document.documentElement;
                    containerClassList = container.classList;

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
                    containerClassList.remove( classFixed );
                    containerClassList.remove( classShown );
                    containerClassList.remove( classHidden );
                  }
                },

              pause: function(){ isPaused = true; },
              resume: function(){ isPaused = false; },

            };


      if ( opts.minimal )
      {
        opts.autoStart  &&  widget.start();
      }
      else
      {
        // old fat behavior - handle formatChange
        // disallow certain customization to avoid this fat magic causing obscure side-effects
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
                  $(document)
                      .on('mobilemenuopen',function(){  widget.pause();  })
                      .on('mobilemenuclosed', function(){  widget.resume();  });
                  !mediaGroupOptValue  &&  $win.off(formatChangeEv);
                }
                else if ( isActive && mediaGroup(media,'left') )
                {
                  widget.stop();
                  $(document)
                      .off('mobilemenuopen mobilemenuclosed');
                }
              });
        triggerOldFormatChangeEvent( formatChangeEv );
      }

      return widget;
    };


})(window);
