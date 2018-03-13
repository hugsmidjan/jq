/* jQuery.fn.listscroller 1.1  -- (c) 2009-2017 Hugsmiðjan ehf.  @preserve */

// ----------------------------------------------------------------------------------
// jQuery.fn.listscroller v 1.1
// ----------------------------------------------------------------------------------
// (c) 2009-2017 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
//   * Borgar Þorsteinsson  -- http://borgar.undraland.com
//   * Valur Sverrisson
// ----------------------------------------------------------------------------------

// todo : set position to list element / page that receives 'focusin'
// todo : automove => slideshow, marquee
// todo : callback function when animation finishes ( on hold, pending use )
// Depends on:
//  - eutils 1.0+ :  $.fn.deepest() og  $.fn.setFocus()
(function ($, True, False) {

  $.listscroller = {

    version: 1.0,

    defaultConfig: {

      item:              '',

      windowSize:        3,   // how many unmarked items
      stepSize:          1,   // how many items to move at a time
      startPos:          0,   // number or 'random'

      hideClass:         'overflow',
      topClass:          'at-top',
      bottomClass:       'at-bottom',

      wrap:              'both',   // none|start|end|both|loop|random
      overflow:          'visible',  // visible|hidden  // 'hidden' means that there's never empty space on the last "page"

      controls:          'below',   // none|both|above|below

      animation:         'none',     // none|carousel|crossfade|accordion, or custom function
      easing:            'swing',
      speed:             600,

      aspect:            'auto',     // auto|horizontal|vertical
      //paging:            False,    // indicates wheather to render `jumpPager` links or `statusPager` info (set below)
      jumpPager:         True,   // toggles the "Pages: (1) (2) (3) (4)" links - Kicks in if `paging` is set to `true`
      //statusPager:       False,  // toggles the "Page: 1 of 6" status message
      //inputPager:        False,  // true forces the `statusPager` option to `true` (unless `itemStatusPager` is set to true) and turns the current-page number into a text input field.
      //itemStatusPager:   False,  // true changes statusPager to count items shown rather than "pages" ... e.g. "Displaying: 1-4 of 13 items"

      autoScrollDelay:   0, //Timeout in ms for autoscroll
      setFocus:          True,   // lets setPos trigger() .focus on the first currently visible list element.

      moveCallback:      function () {},

      classPrefix:       'listscroller',
      currentPageClass:  'current',
      currentItemClass:  'visible',
      cursorItemClass:   'current',

      pagingTopClass:    'paging paging-top',
      pagingBottomClass: 'paging paging-bottom',


      pagingTemplate:    '<div><ul class="stepper"/></div>',
      nextBtnTemplate:   '<li class="next"><a href="#"/></li>',
      prevBtnTemplate:   '<li class="prev"><a href="#"/></li>',

      jumpTemplate:      '<li class="jump"/>',
      jumpLabelTemplate: '<strong/>',
      jumpWrapTemplate:  '<span/>',
      jumpBtnTemplate:   '<a href="#"/>',

      statusTempl:       '<div class="status"/>',
      statusLabelTempl:  '<strong/>',
      statusWrapTempl:   '<span/>',
      statusCurrTempl:   '<b/>',
      statusTotalTempl:  '<i/>',
      inputPagerTempl:   '<input type="text" value="" size="2"/>'

      //destroy:           false // true strips away all listscroller classes, paging elements, etc. etc.
    },


    i18n: {
      en: {
          labelNext:         'Next',
          labelPrev:         'Previous',
          titleNext:         'Page forward',
          titlePrev:         'Page back',

          jumpLabel:         'Pages:',

          statusLabel:       'Page: ',
          ofTotalSeparator:  ' of ',
          statusLabelAfter:  ''
        },
      is: {
          labelNext:         'Næsta',
          labelPrev:         'Fyrri',
          titleNext:         'Fletta áfram',
          titlePrev:         'Fletta til baka',

          jumpLabel:         'Síður:',

          statusLabel:       'Síða: ',
          ofTotalSeparator:  ' af ',
          statusLabelAfter:  ''
        },
      no: {
          labelNext:         'Neste',
          labelPrev:         'Tidligere',
          titleNext:         'Bla frem',
          titlePrev:         'Bla tilbake',

          jumpLabel:         'Sider:',

          statusLabel:       'Side: ',
          ofTotalSeparator:  ' af ',
          statusLabelAfter:  ''
        },
      da: {
          labelNext:         'Næste',
          labelPrev:         'Tidligere',
          titleNext:         'Rul frem',
          titlePrev:         'Rul tilbage',

          jumpLabel:         'Sider:',

          statusLabel:       'Side: ',
          ofTotalSeparator:  ' af ',
          statusLabelAfter:  ''
        },
    },

    animate : {
      none : function ( l, c ) {},
      carousel : function ( l, c ) {
        var p,
            w = l.eq(0).closest( '.' + c.classPrefix + '-wrapper'),
            z = l.eq( l.length -1 ),
            last = l.length - c.stepSize,
            isHoriz = (c.aspect === 'horizontal'),
            scrollProp = isHoriz ? 'scrollLeft' : 'scrollTop',
            posProp = isHoriz ? 'left' : 'top',
            dimp = isHoriz ? 'outerWidth' : 'outerHeight',
            conf = {};

        w.stop();
        p = l.eq( c.index ).position();
        conf[scrollProp] = p[posProp];

        if ( c.wrap == 'loop' && c.lastIndex == 0 && c.index == last )
        {
          w[scrollProp]( z.position()[posProp] + z[dimp]() );
          w.animate( conf, c.speed, c.easing );
        }
        else if ( c.wrap == 'loop' && c.lastIndex == last && c.index == 0 )
        {
          conf[scrollProp] = z.position()[posProp] + z[dimp]();
          w.animate(conf, c.speed, c.easing, function(){ w[scrollProp](0); });
        }
        else
        {
          w.animate( conf, c.speed, c.easing );
        }
      },
      crossfade : function ( l, c ) {
        l.each(function (i, nw, ow ){
          nw = (i >= c.index && i < c.index + c.windowSize);
          ow = (c.lastIndex == null) || (i >= c.lastIndex && i < c.lastIndex + c.windowSize);
          if ( !nw && c.lastIndex == null ) // init
          {
            $(this).stop().hide();
          }
          else if ( nw && !ow ) // show
          {
            $(this).stop().hide().fadeIn( c.speed );
          }
          else if ( !nw && ow )  // hide
          {
            $(this).stop().show().css({ opacity : 1 }).fadeOut( c.speed );
          }
        });
      },
      accordion : function ( l, c ) {
        var ac, ap = (c.aspect == 'vertical') ? 'height' : 'width';
        l.each(function (i, nw, ow ){
          nw = (i >= c.index && i < c.index + c.windowSize);
          ow = (c.lastIndex == null) || (i >= c.lastIndex && i < c.lastIndex + c.windowSize);
          ac = {};
          if ( !nw && c.lastIndex == null )  // init
          {
            $(this).stop().hide();
          }
          else
          {
            ac[ap] = (nw && !ow) ?  'show':  (!nw && ow) ?  'hide':  undefined;
            ac[ap]  &&  $(this).stop().animate( ac, c.speed, c.easing, function(){ this.style[ap] = ''; });
          }
        });
      }
    },

    wrap : {
      // foo: function ( index, list, cfg ) { return 1; }
      none: function ( i, l, c ) {
        return Math.max( Math.min( i, max( l, c ) ), 0 );
      },
      start: function ( i, l, c ) {
        var m = max( l, c );
        if ( i < 0 ) { return (c.index == 0) ? m : 0; }
        if ( i > m ) { return m; }
        return i;
      },
      end: function ( i, l, c ) {
        var m = max( l, c );
        if ( i < 0 ) { return 0; }
        if ( i > m ) { return (c.index == m) ? 0 : m; }
        return i;
      },
      both: function ( i, l, c ) {
        var m = max( l, c );
        if ( i < 0 ) { return (c.index == 0) ? m : 0; }
        if ( i > m ) { return (c.index == m) ? 0 : m; }
        return i;
      },
      random: function ( i, l, c ) {
        return Math.floor( Math.random() * l.length );
      },
      loop: function ( i, l, c ) {
        return (l.length+i) % l.length;
      }
    },

    aspectDefaults : {
      none      : 'vertical',
      carousel  : 'horizontal',
      crossfade : 'horizontal',
      accordion : 'vertical'
    }

  };

  // detect list aspect
  function detectAspect ( _items )
  {
    var i2 = _items.eq( 1 ),
        p1 = _items.eq( 0 ).offset(),
        p2 = i2.offset();
    // usable second item?
    if ( p2 && i2.is(':visible') )
    {
      return ( Math.abs( p2.top - p1.top ) <= Math.abs( p2.left - p1.left ) )
              ? 'horizontal'
              : 'vertical';
    }
    // indeterminate
    return False;
  }

  function max ( list, cfg )
  {
    var maxVal = (cfg.overflow == 'visible') ?
                      list.length - (list.length % cfg.stepSize || cfg.stepSize):
                      list.length - cfg.windowSize;
    return maxVal;
  }

  function setPos ( c, _newIndex, opts )
  {
    clearTimeout( c.scrollTimeout );

    opts = opts || {};
    var _block = c.block;
    var list   = c.list;
    c.lastIndex = c.index;
    c.index = $.listscroller.wrap[ c.wrap || 'none' ]( _newIndex, list, c );

    if ( c.index != c.lastIndex )
    {
      _block.trigger('beforeMove', {newIndex: c.index});

      list
          .addClass( c.hideClass )
          .removeClass( c.cursorItemClass )
          .removeClass( c.currentItemClass )
          .slice( c.index, c.index + c.windowSize )
              .addClass( c.currentItemClass )
              .removeClass( c.hideClass )
              .eq(0)
                  .addClass( c.cursorItemClass );

      if ( $.isFunction( c.moveCallback ) )
      {
        c.moveCallback.call( _block, list, c );
      }

      if ( $.isFunction( c.animation ) )
      {
        c.animation.call( _block, list, c );
      }
      else
      {
        $.listscroller.animate[ c.animation||'none' ].call( _block, list, c );
      }
      // Food for thought: should we move this block out of the c.index != c.lastIndex check??
      if ( !opts._noFocus  &&  c.setFocus )
      {
        setTimeout(function(){
            list.eq( c.index ).setFocus();
          }, c.speed || 1 );
      }

      _block
        .removeClass( c.topClass )
        .removeClass( c.bottomClass );

      if ( c.index == 0 )
      {
        _block.addClass( c.topClass );
      }

      if ((list.length - c.index) <= c.windowSize)
      {
        _block.addClass( c.bottomClass );
      }

      // flash the container
      if (!opts._noFlash)
      {
        _block.addClass( c.classPrefix + '-changed' );
        setTimeout(function(){
            _block.removeClass( c.classPrefix + '-changed' );
          }, c.speed || 1);
      }

      var newWinIndex = Math.ceil(c.index / c.stepSize);
      // mark paging/status/ element if needed
      if ( c.jumps )
      {
        c.jumps
            .removeClass( c.currentPageClass )
            .eq( newWinIndex )
                .addClass( c.currentPageClass );
      }

      var newSatusIndex = c.itemStatusPager ?  c.index : newWinIndex;
      c.inputPager  &&  c.inputPager.val( newWinIndex+1 );
      c.status      &&  c.status.text( newSatusIndex+1 );

      if (c.status  &&  c.itemStatusPager  &&  c.windowSize > 1)
      {
        var lastIdx = newSatusIndex + c.windowSize;
        lastIdx = ( lastIdx > list.length ) ? list.length : lastIdx;
         c.status.append( '-' + lastIdx );
      }

      if(c.autoScrollDelay)
      {
        _block.queue(function () {
            _block
                .trigger('afterMove')
                .dequeue();
          });
      }
    }

  }

  function movePrev ( e )
  {
    var c = e.data;
    setPos( c, c.index - c.stepSize );
    e.preventDefault();
  }

  function moveNext ( e )
  {
    var c = e.data;
    setPos( c, c.index + c.stepSize );
    e.preventDefault();
  }

  function movePage ( e )
  {
    var c = e.data,
        p = (parseInt( $( this ).text(), 10 ) -1) || 0;
    setPos( c, p * c.stepSize );
    e.preventDefault();
  }

  function inputChange ( e )
  {
    var cfg = e.data,
        pageIndex = Math.max(0, parseInt('0'+$( this ).val(), 10 )-1)  ||  0,
        newPos = Math.min(pageIndex*cfg.stepSize, max(cfg.list, cfg) );
    setPos( cfg, newPos );
    e.preventDefault();
  }


  function buildControls ( cfg )
  {

    var nextBtn = $( cfg.nextBtnTemplate ),
        prevBtn = $( cfg.prevBtnTemplate ),
        jumpMenu,
        status;

    $(nextBtn.find('a')[0]||nextBtn)
        .bind( 'click', cfg, moveNext )
        .attr( 'title', cfg.titleNext )
        .text( cfg.labelNext );

    $(prevBtn.find('a')[0]||prevBtn)
        .bind( 'click', cfg, movePrev )
        .attr( 'title', cfg.titlePrev )
        .text( cfg.labelPrev );


    if ( cfg.paging )
    {
      var page = Math.ceil( cfg.index / cfg.stepSize ),
          numWindows = Math.ceil( cfg.list.length / cfg.stepSize ),
          statusNumTotal = cfg.itemStatusPager ? cfg.list.length : numWindows;

      // input pager
      if (cfg.statusPager  ||  cfg.inputPager)
      {
        status = $( cfg.statusTempl );
        $( cfg.statusLabelTempl )
            .html( cfg.statusLabel )
            .appendTo( status );

        var jTemp = $( cfg.statusWrapTempl )
                        .appendTo( status );

        $( cfg.statusTotalTempl )
            .html( cfg.ofTotalSeparator + statusNumTotal + cfg.statusLabelAfter )
            .appendTo( jTemp );

        if ( cfg.inputPager )
        {
          cfg.inputPager = $( cfg.inputPagerTempl )
                        .prependTo( jTemp )
                        .val( page+1 )
                        .bind( 'change', cfg, inputChange );
        }
        else
        {
          cfg.status =  $( cfg.statusCurrTempl )
                          .prependTo( jTemp );
        }
      }

      // jump buttons
      if (cfg.jumpPager)
      {
        var jmps = [];
        jumpMenu = $( cfg.jumpTemplate );
        if ( cfg.jumpLabelTemplate )
        {
          $( cfg.jumpLabelTemplate )
              .text( cfg.jumpLabel )
              .appendTo( jumpMenu );
        }
        // make buttons+
        for (var i=0; i<numWindows; i++)
        {
          var bt = $( cfg.jumpBtnTemplate ),
              a = $(bt.find('a')[0]||bt)
                      .text( i + 1 )
                      .attr('title', cfg.statusLabel + (i + 1) )
                      .addClass('p' + (i+1))
                      .bind( 'click', cfg, movePage );
          if (cfg.index == i) { a.addClass( cfg.currentPageClass ); }
          jmps.push( bt[0] );
        }
        cfg.jumps = $( jmps );
        $( cfg.jumpWrapTemplate || [] )
            .append( cfg.jumps )
            .appendTo( jumpMenu );
      }

    }

    return $( cfg.pagingTemplate )
                .deepest()
                    .append(nextBtn, prevBtn, jumpMenu)
                .end()
                .prepend( status );
  }



  function initScroller ( cfg, _block, _items )
  {
    var _inner,
        _outer;

    var oldCfg = _block.data('listscrollerCfg');
    if ( oldCfg )
    {
      // reset/clear to allow a fresh start

      _block.removeData('listscrollerCfg');

      _inner = oldCfg.list.parent();
      _outer = _inner.parent();
      if ( cfg.destroy )
      {
        _inner.filter('div').zap();
        _outer.zap();
        _inner = _outer = undefined;
      }

      clearTimeout( oldCfg.scrollTimeout );

      var oldDisplay = _block[0].style.display || ''; // Recent versions of jQuery always return a nno-empty value on .css('display')
      _block
          .hide()
          .removeClass( oldCfg.classPrefix + '-active' )
          .removeClass( oldCfg.topClass )
          .removeClass( oldCfg.bottomClass )
          .removeClass( 'block-mouseover' )
          .unbind('.lscr')
          .data('lstscr_pagingElms')
              .remove();
      _block
          .removeData('lstscr_pagingElms');
      oldCfg.list
          .removeClass( oldCfg.hideClass )
          .removeClass( oldCfg.cursorItemClass )
          .removeClass( oldCfg.currentItemClass )
          .css({'display':''});
      oldCfg.flipover && oldCfg.flipover
          .remove();
      _inner && _inner
          .removeClass( oldCfg.classPrefix + '-clip' )
          .css( 'position', '' );
      _outer && _outer
          .scroll(0,0)
          .removeClass( oldCfg.classPrefix + '-wrapper' )
          .removeClass( oldCfg.classPrefix + '-' + oldCfg.aspect )
          .css( 'position', '' );
      _block
          .css( 'display', oldDisplay );
      // END: Cleanup/Reset

    }

    if ( !cfg.destroy )
    {

      _items = typeof _items == 'string' ?
              _block.find( _items ):
              _items;

      if ( !oldCfg )
      {
        // wrap elements with containers
        _inner = _items.eq( 0 ).is( 'li' ) ?
                    _items.parent():
                    _items.wrapAll( '<div />' ).parent();
        _outer = _inner.wrap( '<div />' ).parent();
      }

      cfg.list = _items;
      cfg.block = _block;
      _block.data('listscrollerCfg', cfg);

      _block
          .addClass( cfg.classPrefix + '-active' );
      _outer
          .addClass( cfg.classPrefix + '-wrapper' )
          .addClass( cfg.classPrefix + '-' + cfg.aspect );
      _inner
          .addClass( cfg.classPrefix + '-clip' )
          .add( _outer )
              .css( 'position', 'relative' );

      // for circular carousels
      if ( cfg.wrap == 'loop' )
      {
        // generate flipover items
        cfg.flipover = _items
                        .slice( 0, cfg.windowSize )
                            .clone( True )
                            .addClass('listscroller-clone');
        _items
            .parent()
                .append( cfg.flipover );
      }

      // create and display control-links
      var pagingElms = [];
      if ( cfg.controls !== 'none' && _items.length > 0 )
      {
        if ( /^(above|both)$/.test( cfg.controls ) )
        {
          pagingElms.unshift( buildControls( cfg ).addClass( cfg.pagingTopClass )[0] );
          _outer
              .before( pagingElms[0] );
        }

        if ( /^(below|both)$/.test( cfg.controls ) )
        {
          pagingElms.unshift( buildControls( cfg ).addClass( cfg.pagingBottomClass )[0] );
          _outer
              .after( pagingElms[0] );
        }

      }
      _block.data('lstscr_pagingElms', $(pagingElms) );

      if ( cfg.aspect == 'auto' )
      {
        cfg.aspect = detectAspect( _items ) || // try to determine aspect
                   $.listscroller.aspectDefaults[ cfg.animation ] ||  // pick default aspect for animation
                   'horizontal';  // final fallback
      }
      _outer.addClass( cfg.classPrefix + '-' + cfg.aspect );

      //randomize starting position
      if ( cfg.startPos == 'random' )
      {
        cfg.startPos = Math.floor(Math.ceil(_items.length / cfg.stepSize) * Math.random()) * cfg.stepSize;
      }

      // set initial position
      setPos( cfg, cfg.startPos || 0, { _noFlash:True, _noFocus:True } );

      var nextTrigger = function ( e ) {
            setPos( cfg, cfg.index + cfg.stepSize, { _noFlash:True, _noFocus:True } );
          },
          prevTrigger = function ( e ) {
            setPos( cfg, cfg.index - cfg.stepSize, { _noFlash:True, _noFocus:True } );
          };

      var delay = cfg.autoScrollDelay;
      if ( delay )
      {
        cfg.scrollTimeout = setTimeout( nextTrigger, delay );
        _block
            .bind('mouseenter.lscr', function (e) {
                _block.addClass('block-mouseover');
                clearTimeout(cfg.scrollTimeout);
              })
            .bind('mouseleave.lscr', function (e) {
                _block.removeClass('block-mouseover');
                clearTimeout(cfg.scrollTimeout);
                cfg.scrollTimeout = setTimeout( nextTrigger, delay );
              })
            .bind('afterMove.lscr', function (e) {
                if ( !_block.is('.block-mouseover') )
                {
                  clearTimeout(cfg.scrollTimeout);
                  cfg.scrollTimeout = setTimeout( nextTrigger, delay );
                }
              });
      }

      if ( cfg.aspect == 'horizontal' )
      {
        _block
            .on('swipeleft', function (e) {
                nextTrigger();
              })
            .on('swiperight', function (e) {
                prevTrigger();
              });
      }
      else if ( cfg.aspect == 'vertical' )
      {
        _block
            .on('swipeup', function (e) {
                nextTrigger();
              })
            .on('swipedown', function (e) {
                prevTrigger();
              });
      }

    }

  }


  $.fn.listscroller = function ( config )
  {
    var dc = $.listscroller.defaultConfig;
    if ( (config && (config.item || config.destroy)) || dc.item )
    {
      this.each(function () {
          var b = $( this ),
              _lang = b.closest('[lang]').attr( 'lang' ) || '',
              i18n = $.listscroller.i18n,
              txts = i18n[_lang.toLowerCase()] || i18n[_lang.substr(0,2)] || i18n.en,
              cfg = $.extend( {}, dc, txts, config );

          if (cfg.itemStatusPager)
          {
            cfg.inputPager = False;
          }

          initScroller(
              cfg,
              b,
              cfg.item
            );
        });
    }
    else if (this.length)
    {
      this.eq(0)
          .parent()
              .listscroller(
                  $.extend( {}, config, { item: this })
                );
    }
    return this;

  };

})(jQuery, !0, !1);
