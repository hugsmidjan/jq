// ----------------------------------------------------------------------------------
// jQuery.fn.tabSwitcher/.makeTabbox  v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
//   * Borgar Þorsteinsson  -- http://borgar.undraland.com
// ----------------------------------------------------------------------------------

/*
  Requires
   * jQuery 1.3 or better (event bubbling)
   * Eutils ($.setFrag, $.beget)
*/

(function($, document){

/*
  $.event.special.fragment = {
    setup : function () {
      //data = $.extend({ speed: hover.speed, delay: hover.delay, hovered:0 }, data||{} );
      //$.event.add( this, "mouseenter mouseleave", hoverHandler, data );
    },
    teardown : function () {
      $.event.remove( this, "mouseenter mouseleave", hoverHandler );
    }
  };


  fragment: (function(){
    var _lastFragment = _docLoc.hash,
        _fragmentMonitor;
    return {
      add: function (_object, _handler, _isFirst)
      {
        if (_isFirst && _object === _doc)
        {
          _fragmentMonitor = setInterval(function(){
            // NOTE: this only detects forward motion in IE6.
            //        Navigating back updates the address in the address bar,
            //        but doesn't update the document.location object.
            // NOTE: navigating back through fragments in IE7 doesn't update the "forward" history buffer.
            if (_docLoc.hash != _lastFragment)
            {
              _lastFragment = _docLoc.hash;
              _Event.fire(_doc, 'fragment');
            }
          }, 200);
        }
      },
      remove: function (_object, _handler, _isLast)
      {
        if (_isLast  &&  (_object === _doc)) { clearInterval(_fragmentMonitor); }
      }
    };
  })()

*/

  // ===  internal variables  ===

  var _cookieTargets,
      _hashTarget,
      _inEventPhase = false,
      _openTabs = {},  // a list of all currently active tabs
      _allTabIds = {},
      _tabsToOpen,

      _cookieName = 'tabswitcher',
      _tabswitcherData = _cookieName, // to save bytes

  // ===  internal support functions  ===


      closePanel = function ( id )
      {
        // grab the panel
        var panel = $( '#' + id );
        var data  = panel.data( _tabswitcherData );
        var c = data.config;

        // de-highlight the tab
        data.tab.removeClass( c.currentTabClass );

        // unwrap the `currentTabTag` element if it exists
        if ( c.currentTabTag )
        {
          data.tab.find( c.currentTabTag ).zap();
        }

        // hide the tabPanel block
        if (c.cssHide) {
          panel.addClass( c.hiddenPaneClass );
        }
        else {
          panel.hide();
        }

        if (c.openTabId == id) { delete c.openTabId; }
        delete _openTabs[id];

        data.block.trigger( 'Tabclose', id );
        panel.trigger( 'Panelclose', id );

      },



      openPanel = function ( id )
      {

        var panel = $( '#' + id );
        var data  = panel.data( _tabswitcherData );
        var c = data.config;

        // highlight the tab
        data.tab.addClass( c.currentTabClass );

        // add new STRONG to current tab
        // but don't add strong to tabs that already have it
        if ( c.currentTabTag  &&  !$( c.currentTabTag, data.link ).length )
        {
          data.link.wrapInner('<'+ c.currentTabTag +'/>');
        }

        // hide the tabPanel block
        if ( c.cssHide ) {
          panel.removeClass( c.hiddenPaneClass );
        }
        else {
          panel.show();
        }

        c.openTabId = id;
        _openTabs[id] = true;

        data.block.trigger( 'Tabopen', id );
        panel.trigger( 'Panelopen', id );

      },



      // event delegate monitor that grabs
      // FIXME: Finish this comment...
      crossReferenceMonitor = function ( e )
      {
        var l = $(e.target).closest('a, area');
        if ( l.is('[href*="#"]')  &&  !l.data(_tabswitcherData+'Link')  &&  document.location.href.split('#')[0]==l[0].href.split('#')[0] )
        {
          var id = $.getFrag( l[0].href );
          if (id  &&  _allTabIds[id] )
          {
            $.tabSwitcher.switchTo( id );
            e.preventDefault();
          }
        }
      },

      switchToFragmentPanel = function (e)
      {
        $.tabSwitcher.switchTo( this );
        e.preventDefault();
      },

      returnToTab = function (e)
      {
        $(this).parent().data( _tabswitcherData ).tab.setFocus();
        return false; // no bubbling!
      },


      detectNestedTabswitch = function (e)
      {
        e.target !== this  &&  $.tabSwitcher.switchTo( this.id, true );
      },

      startFragmentMonitoring = function () {

      };


  $.extend({
    tabSwitcher : {

      version : 1.0,

      fixInitScroll : true,

      // the tabswitcher keeps the current status of tabs in a 20 minute session if this is set
      cookieName:        _cookieName,    // tabs status cookie state  - setting this to "" will disable it's use
      cookiePath:        '/',              // set to '' to set a unique cookie for each page.
      cookieTTL:         1200,             // Number of seconds before we forget the tab-satus  (1200 sec / 60 = 20 min)

      defaultConfig:  {
        tabSelector:       'li',
        stripActiveClass:  'tabs-active',
        currentTabClass:   'current',
        currentTabTag:     'strong',      // emphasis tag for current element - setting this to "" will disable it's use
        paneClass:         'tabpane',
        hiddenPaneClass:   'tabpane-hidden',  // only used when `cssHide` option is set to true.
        cssHide:           false,             // Should the script hide the sections with theSection.style.display="none" (false) or with simple CSS class names (true); ??
        showFirst:         true,
        setCookie:         true,
        setFragment:       true,          // allow or disallow fragment changes as tabs are switched.

        // template for a link placed at the top of the panel. use '' to disable
        focusLinkTemplate:  '<a href="#" class="focustarget">.</a>',
        // template for a link placed at the bottom of the panel. use '' to disable
        returnLinkTemplate: '<a href="#" class="stream">.</a>',

        en:  {
          backLinkText:     'Back to '
        },
        is:  {
          backLinkText:     'Til baka í '
        }
      },



      // public method for manually setting/swicthing tabs.
      // newTab may be either string or a link element
      switchTo : function ( _newTab, silentSwitch ) {
        var id     = _newTab.href ? $.getFrag(_newTab.href) : _newTab, // accepts: linkElm, URL, DOM-id
            panel  = $( '#' + id ),
            d      = panel.data( _tabswitcherData ),
            c      = d.config,
            from   = c.openTabId;

        if (c)
        {
          // Note: we always fire the event... even if the new tab was already open
          d.block.trigger('Tabswitch', {
            from : from,
            to   : id
          });

          if (c.openTabId != id) { // redundant if the new tab is already open.
            if (c.openTabId)
            {
              closePanel( c.openTabId );
            }
            // open our new selection
            openPanel( id );
            // save session cookie with current indexes
            /*if (tabSwitcher.cookieName  &&  _config.setCookie) {
              _setTabCookie();
            }*/
          }

          if ( !silentSwitch ) {
            if ( c.setFragment ) {
              $.setFrag( id );
            }
            if (d.focusLink) {
              $.setFocus( d.focusLink );
            }
          }

          // Note: we always fire the event... even if the new tab was already open
          d.block.trigger('Tabswitched', {
            from : from,
            to   : id
          });
        }
      }

    }
  });




  $.fn.tabSwitcher = function ( conf )
  {

    var _hashTarget = $.getFrag();

    // todo : detect usage of id, or index to set tab index => switchto

    _tabsToOpen = [[],[],[],[]];
    this.each(function() {

      var block     = $( this ),
          _conf     = $.extend( {}, $.tabSwitcher.defaultConfig, conf ),
          tabs      = $( _conf.tabSelector, this ),
          openTabId = '',
          openLevel = 0;

      _conf.tabs = {};
      _conf.tabBlock = this;
      tabs.each(function ( i, t ) {
          var data    = { tab : $(t) },
              link    = data.link   = (t.tagName == 'A') ? data.tab : $( 'a', t ),
              lang    = (link.closest('[lang]').attr('lang') || 'en').substr(0,2);
          data.lang   = _conf[lang] ? lang : 'en';
          data.config = _conf;
          data.block  = block;
          var id      = $.getFrag( link.attr('href') ),
              panel   = $(id ? '#'+id : []);
          panel.data( _tabswitcherData, data );

          if (panel.length)
          {

            panel.addClass( _conf.paneClass );
            var backtxt = _conf[data.lang].backLinkText + data.tab.text();


            // Accessibility: Add a focusAnchor (+ "return to tab" link) to the top of the _tabPanelElm.
            if (_conf.focusLinkTemplate) {
              data.focusLink = $( _conf.focusLinkTemplate )
                                      .attr( 'title', backtxt )
                                      .bind( 'click', returnToTab )
                                      .prependTo( panel );
            }
            // Add a second "return to tab" link to the bottom of the _tabPanelElm.
            if (_conf.returnLinkTemplate) {
              data.returnLink = $( _conf.returnLinkTemplate )
                                      .attr( 'title', backtxt )
                                      .bind( 'click', returnToTab )
                                      .appendTo( panel );
            }

            // DEFAULT: we don't have an id to open and are on the first item -- set that by default
            if (!i  &&  !openTabId  &&  _conf.showFirst) {
              openTabId = id;
              openLevel = 1; // DEFAULT;
            }
            // DOM/ELEMENT: is the index element marked current? -- mark that
            if (openLevel < 2  &&  data.tab.hasClass( _conf.currentTabClass )) {
              openTabId = id;
              openLevel = 2; // ELEMENT;
            }
            // COOKIE: is the _tabId in a cookie -- mark that
            if (openLevel < 3  &&  _conf.setCookie  &&  _cookieTargets  &&  $.inArray(_cookieTargets, id)>-1) {
              openTabId = id;
              openLevel = 3; // COOKIE;
            }
            // HASH: is the index element marked current? -- trumps all
            if (openLevel < 4  &&  _hashTarget == id) {
              $(window).scrollTop(0);
              openTabId = id;
              openLevel = 4; // HASH;
            }

            data.tab
                .bind('click', function (e) { return false; /* cancel the bubble! */ });
            ( data.tab.is('a') ? data.tab : data.tab.find('a:first') )
                .data(_tabswitcherData+'Link', 1)
                .bind('click', switchToFragmentPanel);


            closePanel( id );

            // register all tab id's
            _allTabIds[id] = true;

            // Detect bubbling TabSwitch events (from nested tab-panes) and switch to the current tabpane
            panel
                .bind('Tabswitch', detectNestedTabswitch);

          }

        });

      // open and activate
      block.addClass( _conf.stripActiveClass );
      if (openTabId)
      {
        // schedule for opening when _setParentTabTriggers has finished running
        _tabsToOpen[openLevel-1].unshift( openTabId );
      }

      // Remove the fragment from the location bar --- if that's really what we want. ...?
      if ($.tabSwitcher.fixInitScroll && openLevel == 4 /*_LEVEL.HASH*/  && !_conf.setFragment) {
        document.location.hash = '';
      }

    });

    // `switchTo` all the tabs that have been scheduled for opening.
    // todo : consider pushing this to next thread
    for (var i=0; i<4; i++) {
      var tabIds = _tabsToOpen[i];
      for (var j=0, tabId; (tabId = tabIds[j]); j++) {
        $.tabSwitcher.switchTo( tabId, true );
      }
    }

    $(document).bind('click', crossReferenceMonitor );
    return this;

  }; // tabswitcher





  // Makes .tabbox for those tabpane collections that lack it.
  // auto-assigns IDs, and pushes the newly created tabbox onto the stack.
  var makeTabbox = $.fn.makeTabbox = function ( cfg ) {
          cfg =  $.beget(tabboxDefaults, cfg);

          var tabBox = [],
              tabPanes = this;
          if (tabPanes.length >= cfg.min)
          {
            tabBox = $( cfg.boxTempl ).addClass( cfg.boxClass );
            var tabList = cfg.tabContSel ? $(cfg.tabContSel, tabBox) : tabBox,
                paneParent = tabPanes.eq(0).parent(),
                refLang = paneParent.closest('[lang]').attr('lang') || '';

            paneParent.attr('lang', refLang);  // to speed up lookup of paneLang later.

            tabPanes
                .each(function(){
                    var tabPane = $(this);
                    tabPane.aquireId(cfg.defaultId);
                    var newTab = cfg.makeTab(tabPane, cfg).appendTo( tabList ),
                        paneLang = tabPane.closest('[lang]').attr('lang');
                    paneLang  &&  paneLang != refLang  &&  newTab.attr('lang', paneLang);
                  })
                .eq(0)
                    .before( tabBox );

          }

          return this.pushStack( tabBox );
        },
      tabboxDefaults = makeTabbox.defaults = {
          min:        2,
          defaultId:  'tab1',
          tabContSel: 'ul',
          titleSel:   'h1, h2, h3',
          boxClass:   'tab-box',
          boxTempl:   '<div><ul class="tabs" /></div>',
          tabTempl:   '<li><a href="#%{id}" title="%{title}">%{title}</a></li>',
          makeTab:    function(tabPane, cfg){
                          return $(  $.inject(cfg.tabTempl, {
                                          id:    tabPane[0].id,
                                          title: tabPane.find(cfg.titleSel).eq(0).text()
                                        })
                                    );
                        }
        };


})(jQuery, document);