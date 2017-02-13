/* jQuery MobileMenu and StickyHeader 1.0  -- (c) 2014-2016 Hugsmiðjan ehf.  @preserve */

// ----------------------------------------------------------------------------------
// Simple mobile menu and stickyHeader behaviour  v 1.0
// ----------------------------------------------------------------------------------
// (c) 2014-2017 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
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


  $.initMobileMenu = function (userOpts) {
      var opts = {
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
      };

      userOpts = userOpts===true ? { minimal:true } : userOpts;
      for (var key in userOpts) {
        val = userOpts[key];
        if ( val !== undefined ) {
          opts[key] = val;
        }
      }

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


  var Q = function (selectorOrElement, root) {
    return typeof selectorOrElement === 'string' ?
              (root||document).querySelector(selectorOrElement):
              selectorOrElement;
  };


  $.initStickyHeader = function (userOpts) {
      var opts = {
      /*
          // The element on which to toggle the state classNames
          container: 'html', // Element | CSS-selector

          // The element on which to monitor scroll events
          scrollElm: window, // Element | CSS-selector

          // Number or a Function to measure the current height of the header element.
          // Defaults to measuring paddingTop of the `container`/<html/> element.
          headerHeight: function () { return parseInt(getComputedStyle(container).paddingTop, 10); }, // number | () => number

          // Height (number or function) at which to unfix the header
          // Defaults to being same as `opts.headerHeight`
          unfixAt: null, // number | () => number,
      */

          // Throttling amount for the onScroll/onResize handler function.
          delay: 50, // ms

          // Should a fixed header be additionally hidden/shown
          // if the page is scrolled beyond a certain up/down pixel limit
          // within a given timeframe of 1000ms?
          recede: true, // boolean | () => boolean
          upLimit: 70, // px
          downLimit: 50, // px

      /*
          // className prefix (`.is-{name}-(fixed|hidden|shown)`)
          name: 'header',

          // true | 1 | window  => Monitor window.onresize events
          // number(>1)  => Recheck the scroll state every `onresize` ms
          onresize:  false, boolean || number

          // minimal mode skips
          //  * jQuery(window).on('formatchange', ...)  event-binding,
          //  * auto-coupling with `mobilemenu(open|closed)` events,
          //  * autoStarting by default.
          minimal: false,

          // Should the widget start automatically when in minimal mode?
          autoStart: false,
      */
      };

      userOpts = userOpts===true ? { minimal:true } : userOpts;
      for (var key in userOpts) {
        val = userOpts[key];
        if ( val !== undefined ) {
          opts[key] = val;
        }
      }

      var name = opts.name || 'header';

      var classPrefix = 'is-'+name;
      var classUnfixed =  classPrefix+'-unfixed';
      var classFixed =  classPrefix+'-fixed';
      var classHidden = classPrefix+'-hidden';
      var classShown =  classPrefix+'-shown';

      var isActive = false;
      var isPaused = false;

      var container; // lazy bound
      var containerClassList; // lazy bound
      var scrollElm; // lazy bound
      var onresize; // lazy bound
      var resizeInterval; // optional setInterval id for non-window resize checks

      var headerHeight = opts.headerHeight;
      headerHeight =  !('headerHeight' in opts) ?
                          function () { return parseInt(getComputedStyle(container).paddingTop, 10); }:
                      typeof headerHeight === 'number' ?
                          function () { return opts.headerHeight; }:
                          headerHeight;

      var unfixAt = opts.unfixAt;
      unfixAt = !('unfixAt' in opts) ?
                    headerHeight:
                typeof unfixAt === 'number' ?
                    function () { return opts.unfixAt; }:
                    unfixAt;


      var widget = {

              upLimit: opts.upLimit,
              downLimit: opts.downLimit,
              recede: opts.recede.apply ? opts.recede : function(){ return opts.recede; },

              // distY: 0
              // isFixed: (distY > 0),
              // isShown: false,

              headerHeight: headerHeight,
              unfixAt: unfixAt,

              start: function () {
                  if ( !isActive )
                  {
                    container = Q(opts.container) || document.documentElement;
                    containerClassList = container.classList;
                    scrollElm = Q(opts.scrollElm) || win;

                    isActive = true;

                    var scrollElmIsWindow = !scrollElm.tagName;
                    var hasPageYOffset = scrollElmIsWindow && ('pageXOffset' in scrollElm);
                    var scrollTopElm = scrollElmIsWindow ? scrollElm.document.documentElement : scrollElm;
                    onresize = opts.onresize;
                    onresize = onresize === 1 ? true : onresize; // accept lecacy code passing 1 instead of true;
                    if (onresize === true) {
                      onresize = scrollElmIsWindow ? scrollElm : win;
                    }

                    var lastOffs = 0;
                    var updateLastOffset;
                    var isFixed = false;
                    var isShown = false;

                    var monitorScroll = function (/*e*/) {
                            if ( !isPaused )
                            {
                              var yOffs = hasPageYOffset ?
                                              scrollElm.pageYOffset:
                                              scrollTopElm.scrollTop;
                              widget.distY = yOffs;
                              var doFix = yOffs > (isFixed ? unfixAt() : headerHeight());
                              clearTimeout( updateLastOffset );

                              if ( doFix !== isFixed )
                              {
                                isFixed = doFix;
                                lastOffs = yOffs;
                                containerClassList[isFixed?'add':'remove']( classFixed );
                                containerClassList[isFixed?'remove':'add']( classUnfixed );
                                if ( !isFixed )
                                {
                                  containerClassList.remove( classShown );
                                  containerClassList.remove( classHidden );
                                  isShown = false;
                                }
                              }
                              if ( isFixed  &&  widget.recede() )
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
                    if ( opts.delay && $.throttleFn ) {
                      monitorScroll = $.throttleFn(monitorScroll, true, opts.delay);
                    }

                    $(scrollElm).on('scroll', monitorScroll);

                    if ( onresize ) {
                      if ( typeof onresize === 'number' ) {
                        resizeInterval = setInterval(monitorScroll, onresize);
                      }
                      else {
                        $(onresize).on('resize', monitorScroll);
                      }
                    }
                    monitorScroll();
                    !widget.isFixed  &&  containerClassList.add( classUnfixed );
                  }
                },
              stop: function () {
                  if ( isActive )
                  {
                    isActive = false;
                    $(scrollElm).off('scroll');
                    if (onresize) {
                      clearInterval( resizeInterval );
                      $(onresize).off('resize');
                    }
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
        var formatChangeEv = 'formatchange.sticky-'+name;
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
