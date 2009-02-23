// TODO: Fix back-navigation jumpyness in IE7 when `monitorFragment=true`
// 
// Requires jQuery 1.3 or better (event bubbling)
// 
(function($){

  // sets the document.location.hash while suppressing the viewport scrolling
  function setHash ( h ) {
    var _dummyElm, _elm = $( '#' + h )[0];
    if (_elm) {
      // temporaily defuse the section block's id 
      _elm.id = '';
      // then insert and position a hidden dummy element to make sure that
      //   a) the hash-change populates the browser's history buffer.
      //   b) the viewport doesn't scroll/jump
      // (NOTE: This may be buggy in IE5 - but that's life)
      var _dummyElm = $('<i id="'+h+'"></i>')
          .css({
            position   : 'absolute',
            visibility : 'hidden',
            overflow   : 'hidden',
            top        : $(window).scrollTop()
          })
          .appendTo(document.body);

    }
    document.location.hash = h;  // set the fragment
    if (_elm) {
      _dummyElm.remove();
      // put the old tab-id back in it's place
      _elm.id = h;
    }
  };

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
      _tabsToOpen;

  // ===  internal support functions  ===

  // get fragment id from URL
  function getHash ( url ) {
    return (url + '').replace( /^.*#/, '' );
  }

  function closePanel ( id ) {

    // grab the panel
    var panel = $( '#' + id );
    var data  = panel.data( 'tabswitcher' );
    var c = data.config;

    // de-highlight the tab
    data.tab.removeClass( c.currentTabClass );

    // unwrap the `currentTabTag` element if it exists
    if ( c.currentTabTag ) {
      var w = data.tab.find( c.currentTabTag );
      if ( w.length ) {
        var p = data.link[0];
        while (w[0].firstChild) { p.appendChild(w[0].firstChild); };
        w.remove();
      }
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

  }

  function openPanel ( id ) {

    var panel = $( '#' + id );
    var data  = panel.data( 'tabswitcher' );
    var c = data.config;

    // highlight the tab
    data.tab.addClass( c.currentTabClass );

    // add new STRONG to current tab
    if ( c.currentTabTag ) {
      // don't add strong to tabs that already have it
      if ( !data.link.find( c.currentTabTag ).length ) {
        data.link.wrapInner( document.createElement( c.currentTabTag ) );
      }
    }

    // hide the tabPanel block
    if ( c.cssHide ) {
      panel.removeClass( _conf.hiddenPaneClass );
    }
    else {
      panel.show();
    }
    
    c.openTabId = id;
    _openTabs[id] = true;

    data.block.trigger( 'Tabopen', id );
    panel.trigger( 'Panelopen', id );

  }

  // event delegate monitor that grabs 
  function crossReferenceMonitor ( e ) {
    if (e.target) {
      // nested tabs are causing recursion overflow
      var l = (e.target.tagName == 'A') ? $( e.target ) : $( e.target ).parents('a');
      if (l.length && l[0].href && l[0].href.indexOf('#')) {
        var id = getHash( l.attr('href') );
        if (_allTabIds[id]) {
          $.tabSwitcher.switchTo( id, true );
          return false;
        }
      }
    }
  }


  // fragment monitoring system
  var _lastSetFragment = null,
      _fragmentsToMonitor = {};

  function monitorFragment ( e ) {
    var _currentFragment = document.location.hash.substr(1);
    if ( _lastSetFragment != _currentFragment  &&  _fragmentsToMonitor[_currentFragment] ) {
      tabSwitcher.switchTo(_currentFragment, true);
      _lastSetFragment = _currentFragment;
    }
  }

  function startFragmentMonitoring() {
    
  }

/*

      _prepModule = function (e) {
        var _cookie = tabSwitcher.cookieName && cookieU.getValue(tabSwitcher.cookieName);
        if (_cookie) { _cookieTargets = _cookie.split(','); }
        _hashTarget = docLoc.hash.substr(1);
      },

*/
/*
      _finalizeModule = function (e) {
        if ($.tabSwitcher.fixInitScroll) { window.scrollTo(0,0); }

        _findOtherLinks();

        _setParentTabTriggers();

        if (!Object.isEmpty(_fragmentsToMonitor))
        {
          EEvent.add(document, 'fragment', _monitorFragment);
        }

        // `switchTo` all the tabs that have been scheduled for opening.
        for (var i=0; i<4; i++)
        {
          var tabIds = _tabsToOpen[i];
          for (var j=0, tabId; (tabId = tabIds[j]); j++)
          {
            tabSwitcher.switchTo(tabId, true);
          }
        }

      },

    _setTabCookie = function () {
      var _openTabIds = [];
      for (var k in _openTabs) { _openTabIds.push(k); };
      cookieU.set(tabSwitcher.cookieName, _openTabIds.join(','), tabSwitcher.cookiePath, tabSwitcher.cookieTTL);
    };

*/
  
  $.extend({
    tabSwitcher : {
      
      version : 1.0,
      
      fixInitScroll : true,

      // the tabswitcher keeps the current status of tabs in a 20 minute session if this is set
      cookieName       : 'tabswitcher',    // tabs status cookie state  - setting this to "" will disable it's use
      cookiePath       : '/',              // set to '' to set a unique cookie for each page.
      cookieTTL        : 1200,             // Number of seconds before we forget the tab-satus  (1200 sec / 60 = 20 min)
      
      defaultConfig : {
        tabSelector      : 'li',
        stripActiveClass : 'tabs-active',
        currentTabClass  : 'current',
        currentTabTag    : 'strong',      // emphasis tag for current element - setting this to "" will disable it's use
        paneClass        : 'tabpane',
        hiddenPaneClass  : 'tabpane-hidden',  // only used when `cssHide` option is set to true.
        cssHide          : false,             // Should the script hide the sections with theSection.style.display="none" (false) or with simple CSS class names (true); ??
        showFirst        : true,
        setCookie        : true,
        setFragment      : true,          // allow or disallow fragment changes as tabs are switched.
        monitorFragment  : false,          // hook up an document.onfragment() (custom)event to automatically switch tabs when the user navigates back/forward in history.  (`.setFragment` must be `true`)

        // template for a link placed at the top of the panel. use '' to disable
        focusLinkTemplate : '<a href="#" class="focustarget">#</a>',
        // template for a link placed at the bottom of the panel. use '' to disable
        returnLinkTemplate : '<a href="#" class="stream">#</a>',

        en : {
          backLinkText     : 'Back to '
        }
      },
      
      i18n : function ( txt, lang ) { return txt; },
      
      
      // public method for manually setting/swicthing tabs.
      // newTab may be either string or a link element
      switchTo : function ( _newTab, silentSwitch ) {
        
        var id    = getHash( _newTab.href || _newTab );
        var panel = $( '#' + id );
        var d     = panel.data( 'tabswitcher' );
        var c     = d.config;
        var from  = c.openTabId;

        if (c) {
          // Note: we always fire the event... even if the new tab was already open
          d.block.trigger('Tabswitch', {
            from : from,
            to   : id
          });

          if (c.openTabId != id) { // redundant if the new tab is already open.
            if (c.openTabId)
              closePanel( c.openTabId );
            // open our new selection
            openPanel( id );
            // save session cookie with current indexes
            /*if (tabSwitcher.cookieName  &&  _config.setCookie) {
              _setTabCookie();
            }*/
          }

          if ( !silentSwitch ) {
            if ( c.setFragment ) {
              _lastSetFragment = id;
              setHash( id );
            }
            if (d.focusLink) 
              d.focusLink.focus();
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

  $.fn.extend({
    tabSwitcher : function ( conf ) {

      // todo : detect usage of id, or index to set tab index => switchto

      _tabsToOpen = [[],[],[],[]];
      this.each(function() {

        var block     = $( this )
        var _conf     = $.extend( {}, $.tabSwitcher.defaultConfig, conf );
        var tabs      = $( _conf.tabSelector, this );
        var openTabId = '';
        var openLevel = 0;

        _conf.tabs = {};
        _conf.tabBlock = this;
        tabs.each(function ( i, t ) {

          var data    = { tab : $(t) };
          data.link   = (t.tagName == 'A') ? data.tab : $( 'a', t );
          data.lang   = data.link.add(data.link.parents()).filter('[lang]').attr('lang') || 'en';
          data.config = _conf;
          data.block  = block;
          var id      = getHash( data.link.attr('href') );
          var panel   = $( '#' + id );
          panel.data( 'tabswitcher', data );

          var returnToTab = function (e) {
            var id = getHash( $( this ).attr('href') );
            var link = $( '#'+id ).data('tabswitcher').link;
            // setHash( DOM.aquireId( link ) );  // --- WTF?
            link.focus();
            return false;
          };
          
          if (panel.length) {

            panel.addClass( _conf.paneClass );
            var backtxt = $.tabSwitcher.i18n( _conf.en.backLinkText, data.lang ) + data.tab.text();

            // Accessibility: Add a focusAnchor (+ "return to tab" link) to the top of the _tabPanelElm.
            if (_conf.focusLinkTemplate)
              data.focusLink = $( _conf.focusLinkTemplate )
                                      .attr( 'href', '#'+id )
                                      .attr( 'title', backtxt )
                                      .click( returnToTab )
                                      .prependTo( panel );
            // Add a second "return to tab" link to the bottom of the _tabPanelElm.
            if (_conf.returnLinkTemplate)
              data.returnLink = $( _conf.returnLinkTemplate )
                                      .attr( 'href', '#'+id )
                                      .attr( 'title', backtxt )
                                      .click( returnToTab )
                                      .appendTo( panel );

            // DEFAULT: we don't have an id to open and are on the first item -- set that by default
            if (!i  &&  !openTabId  &&  _conf.showFirst) {
              openTabId = id;
              openLevel = 1; //DEFAULT;
            }
            // DOM/ELEMENT: is the index element marked current? -- mark that
            if (openLevel < 2  &&  data.tab.hasClass( _conf.currentTabClass )) {
              openTabId = id;
              openLevel = 2; //ELEMENT;
            }
            // COOKIE: is the _tabId in a cookie -- mark that
            if (openLevel < 3  &&  _conf.setCookie  &&  _cookieTargets  &&  $.inArray(_cookieTargets, id)>-1) {
              openTabId = id;
              openLevel = 3; //COOKIE;
            }
            // HASH: is the index element marked current? -- trumps all
            if (openLevel < 4  &&  _hashTarget == id) {
              openTabId = id;
              openLevel = 4; //HASH;
            }

            data.link.click(function (e) { 
              $.tabSwitcher.switchTo( this ); 
              return false;
            });
            closePanel( id );

            // register all tab id's 
            _allTabIds[id] = true;
            
            // register tab id's to monitor
            if (_conf.monitorFragment) {
              _fragmentsToMonitor[id] = true;
            }
            
            panel
              .bind('Tabswitch', function (e){
                if (e.target !== this) {
                  $.tabSwitcher.switchTo( this.id, true );
                }
              })
              // todo: ... consider moving this to document
              .click( crossReferenceMonitor )

          }

        });

        // open and activate
        block.addClass( _conf.stripActiveClass );
        if (openTabId) 
          // schedule for opening when _setParentTabTriggers has finished running
          _tabsToOpen[openLevel-1].unshift( openTabId );

        // Remove the fragment from the location bar --- if that's really what we want. ...?
        if ($.tabSwitcher.fixInitScroll && openLevel == 4 /*_LEVEL.HASH*/  && !_conf.setFragment) {
          document.location.hash = '';
        }

      });

      /*
      if (!Object.isEmpty(_fragmentsToMonitor)) {
        EEvent.add( document, 'fragment', _monitorFragment );
      }
      */

      // `switchTo` all the tabs that have been scheduled for opening.
      // todo : consider pushing this to next thread
      for (var i=0; i<4; i++) {
        var tabIds = _tabsToOpen[i];
        for (var j=0, tabId; (tabId = tabIds[j]); j++) {
          $.tabSwitcher.switchTo( tabId, true );
        }
      }
      
      return this;

    } // tabswitcher
  });

})(jQuery);