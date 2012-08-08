// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.listscroller v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Borgar Þorsteinsson  -- http://borgar.undraland.com
//   * Már Örlygsson        -- http://mar.anomy.net
//   * Valur Sverrisson
// ----------------------------------------------------------------------------------

// todo : set position to list element / page that reports focus (BT: WTF does that even mean?)
// todo : automove => slideshow, marquee
// todo : callback function when animation finishes ( no hold, pending use )
(function ($){

  $.listscroller = {

    version : 1.0,

    defaultConfig : {

      item              : '',

      windowSize        : 3,   // how many unmarked items
      stepSize          : 1,   // how many items to move at a time
      startPos          : 0,

      hideClass         : 'overflow',
      topClass          : 'at-top',
      bottomClass       : 'at-bottom',

      wrap              : 'both',   // none|start|end|both|loop|random
      overflow          : 'hidden',  // visible|hidden

      controls          : 'below',   // none|both|above|below

      animation         : 'none',     // none|carousel|crossfade|accordion, or custom function
      easing            : 'swing',
      speed             : 600,

      aspect            : 'auto',     // auto|horizontal|vertical
      paging            : false,
      inputPager        : false,
      statusPager       : false,

      autoScrollDelay   : 0, //Timeout in ms for autoscroll

      initCallback      : function () {},
      moveCallback      : function () {},

      classPrefix       : 'listscroller',
      currentPageClass  : 'current',
      currentItemClass  : 'visible',
      cursorItemClass   : 'current',

      pagingTopClass    : 'paging-top',
      pagingBottomClass : 'paging-bottom',

      pagingTemplate    : '<div class="paging"><ul class="stepper"/></div>',
      nextBtnTemplate   : '<li class="next"><a href="#"/></li>',
      prevBtnTemplate   : '<li class="prev"><a href="#"/></li>',
      jumpTemplate      : '<li class="jump"/>',
      jumpLabelTemplate : '<strong/>',
      jumpWrapTemplate  : '<span/>',
      jumpBtnTemplate   : '<a href="#"/>',
      statusTemplate    : '<i/>',
      totalTemplate     : '<b/>',
      pagerTemplate     : '<input type="text" value="" size="2"/>',

      statusLabel       : 'Viewing results:',
      jumpLabel         : 'Pages:',
      ofTotalSeparator  : ' of ',
      labelNext         : 'Next',
      labelPrev         : 'Previous',
      titleNext         : 'Page forward',
      titlePrev         : 'Page back'

    },

    i18n : function ( txt, lang ) { return txt; },

    animate : {
      none : function ( l, c ) {},
      carousel : function ( l, c ) {
        var p,
            w = $( '.' + c.classPrefix + '-wrapper', this ),
            z = l.eq( l.length -1 ),
            last = l.length - c.stepSize,
            prop = (c.aspect === 'horizontal') ? 'scrollLeft' : 'scrollTop',
            dimp = (c.aspect === 'horizontal') ? 'outerWidth' : 'outerHeight',
            conf = {};

        w.stop();
        p = l.eq( c.index ).position();
        conf[prop] = p.left;

        if ( c.wrap == 'loop' && c.lastIndex == 0 && c.index == last )
        {
          w[prop]( z.position().left + z[dimp]() );
          w.animate( conf, c.speed, c.easing );
        }
        else if ( c.wrap == 'loop' && c.lastIndex == last && c.index == 0 )
        {
          conf[prop] = z.position().left + z[dimp]();
          w.animate(conf, c.speed, c.easing, function () {
            w[prop]( 0 );
          });
        }
        else {
          w.animate( conf, c.speed, c.easing );
        }
      },
      crossfade : function ( l, c ) {
        l.each(function (i, nw, ow ){
          nw = (i >= c.index && i < c.index + c.windowSize);
          ow = (c.lastIndex == null) || (i >= c.lastIndex && i < c.lastIndex + c.windowSize);
          if ( nw && !ow ) // show
          {
            $(this).stop().hide().fadeIn( c.speed );
          }
          else if ( !nw && c.lastIndex == null ) // init
          {
            $(this).stop().hide();
          }
          else if ( !nw && ow )  // hide
          {
            $(this).stop().show().fadeOut( c.speed );
          }
        });
      },
      accordion : function ( l, c ) {
        var ac, ap = (c.aspect == 'vertical') ? 'height' : 'width';
        l.each(function (i, nw, ow ){
          nw = (i >= c.index && i < c.index + c.windowSize);
          ow = (c.lastIndex == null) || (i >= c.lastIndex && i < c.lastIndex + c.windowSize);
          ac = {};
          if ( nw && !ow ) // show
          {
            ac[ap] = 'show';
            $(this).stop().animate( ac, c.speed, c.easing, function () {
              this.style[ap] = '';
            });
          }
          else if ( !nw && c.lastIndex == null )  // init
          {
            $(this).stop().hide();
          }
          else if ( !nw && ow )  // hide
          {
            ac[ap] = 'hide';
            $(this).stop().animate( ac, c.speed, c.easing, function () {
              this.style[ap] = '';
            });
          }
        });
      }
    },

    wrap : {
      none : function ( i, l, c ) {
        return Math.max( Math.min( i, max( l, c ) ), 0 );
      },
      start : function ( i, l, c ) {
        var m = max( l, c );
        if ( i < 0 ) { return (c.index == 0) ? m : 0; }
        if ( i > m ) { return m; }
        return i;
      },
      end : function ( i, l, c ) {
        var m = max( l, c );
        if ( i < 0 ) { return 0; }
        if ( i > m ) { return (c.index == m) ? 0 : m; }
        return i;
      },
      both : function ( i, l, c ) {
        var m = max( l, c );
        if ( i < 0 ) { return (c.index == 0) ? m : 0; }
        if ( i > m ) { return (c.index == m) ? 0 : m; }
        return i;
      },
      random : function ( i, l, c ) {
        return Math.floor( Math.random() * l.length );
      },
      loop : function ( i, l, c ) {
        return ( (l.length + i) % l.length );
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
    var ret,
        i2 = _items.eq( 1 );
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
    return false;
  }

  function max ( l, c )
  {
    return (c.overflow == 'visible')
        ? Math.floor( l.length / c.stepSize ) * c.stepSize
        : l.length - c.windowSize;
  }

  function setPos ( c, _newIndex, _noflash )
  {

    var _block = c.block;
    var list   = c.list;
    c.lastIndex = c.index;
    c.index = $.listscroller.wrap[ c.wrap || 'none' ]( _newIndex, list, c );

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
      c.animation.call( _block, list, c )
    }
    else
    {
      $.listscroller.animate[ c.animation||'none' ].call( _block, list, c );
    }

    _block
      .removeClass( c.topClass )
      .removeClass( c.bottomClass );

    if ( c.index == 0 )
    {
      _block.addClass( c.topClass );
    }

    if ( c.index == list.length - c.windowSize )
    {
      _block.addClass( c.bottomClass );
    }

    // flash the container
    if (!_noflash)
    {
      _block.addClass( c.classPrefix + '-changed' );
      setTimeout(function () {
        _block.removeClass( c.classPrefix + '-changed' );
      }, c.speed || 1);
    }

    // mark paging link if needed
    if ( c.jumps )
    {
      c.jumps
        .removeClass( c.currentPageClass )
        .eq( Math.ceil(c.index / c.stepSize) )
          .addClass( c.currentPageClass )
    }
    else if ( c.pager )
    {
      c.pager.val( Math.ceil(c.index / c.stepSize) + 1 );
    }
    else if ( c.status )
    {
      c.status.text( Math.ceil(c.index / c.stepSize) + 1 );
    }

  }

  function movePrev ( e )
  {
    var c = e.data;
    setPos( c, c.index - c.stepSize );
    return false;
  }

  function moveNext ( e )
  {
    var c = e.data;
    setPos( c, c.index + c.stepSize );
    return false;
  }

  function movePage ( e )
  {
    var c = e.data,
        p = (parseInt( $( this ).text(), 10 ) -1) || 0;
    setPos( c, p * c.stepSize );
    return false;
  }

  function inputChange ( e )
  {
    var c = e.data,
        p = (parseInt( $( this ).val(), 10 ) -1) || 0;
    setPos( c, p * c.stepSize );
    return false;
  }

  function buildControls ( c, _lang )
  {

    var n = $( c.nextBtnTemplate ),
        p = $( c.prevBtnTemplate ),
        j = $([]),
        i18n = $.listscroller.i18n;

    n.find( 'a' ).andSelf().eq(0)
      .bind( 'click', c, moveNext )
      .attr( 'title', i18n( c.titleNext, _lang ) )
      .text( i18n( c.labelNext, _lang ) );

    p.find( 'a' ).andSelf().eq(0)
      .bind( 'click', c, movePrev )
      .attr( 'title', i18n( c.titlePrev, _lang ) )
      .text( i18n( c.labelPrev, _lang ) );

    if ( c.paging )
    {
      var jmps = [],
          page = Math.ceil( c.index / c.stepSize ),
          l = Math.ceil( c.list.length / c.stepSize );

      j = $( c.jumpTemplate );

      if ( c.jumpLabelTemplate )
      {
        $( c.jumpLabelTemplate )
          .text( i18n( c.jumpLabel, _lang ) )
          .appendTo( j );
      }

      // input pager
      if (c.inputPager)
      {
        c.pager   = $( c.pagerTemplate ).appendTo( j );
        j.append( c.ofTotalSeparator );
        var total = $( c.totalTemplate ).appendTo( j );
        c.pager.bind( 'change', c, inputChange ).val( page +1 );
        total.text( l );
      } else if ( c.statusPager )
      {
        var jTemp = $( c.jumpWrapTemplate ).appendTo( j );
        c.status   = $( c.totalTemplate ).appendTo( jTemp );
        var total = $( c.statusTemplate ).appendTo( jTemp );
        total.text(c.ofTotalSeparator + l );
      }
      // buttons
      else {
        // make buttons
        for (var i=0; i<l; i++) {
          var bt = $( c.jumpBtnTemplate ),
              a = bt.find( 'a' ).andSelf().eq(0)
                    .text( i + 1 ).bind( 'click', c, movePage );
          if (c.index == i) { a.addClass( c.currentPageClass ); }
          jmps.push( a[0] );
        }
        c.jumps = $( jmps );
        $( c.jumpWrapTemplate || [] ).append( c.jumps ).appendTo( j );
      }

    }

    var w  = $( c.pagingTemplate );
    w.map(function(){
        var elem = this;
        while ( elem.firstChild )
          elem = elem.firstChild;
        return elem;
      })
      .append( n, p, j );

    return w;
  }



  function initScroller ( c, _block, _items )
  {

    // test and stop repeat inits
    if ( _block.hasClass( c.classPrefix + '-active' ) )
    {
      return false;
    }

    c.list = _items;
    c.block = _block;

    // wrap elements with containers
    var _ref, _inner, _outer;
    if (_items.eq( 0 ).is( 'li' ))
    {
      _inner = _items.parent();
    }
    else
    {
      _inner = _items.wrapAll( '<div />' ).parent();
    }

    _outer = _inner.wrap( '<div />' ).parent();
    _inner.addClass( c.classPrefix + '-clip' );
    _outer.addClass( c.classPrefix + '-wrapper' );
    _block.addClass( c.classPrefix + '-active' );

    _inner.add( _outer ).css( 'position', 'relative' );
    _outer.addClass( c.classPrefix + '-' + c.aspect );

    // for circular carousels
    if ( c.wrap == 'loop' )
    {
      // generate flipover items
      c.flipover = _items.slice( 0, c.windowSize ).clone( true ).log().addClass('listscroller-clone');
      _items.parent().append( c.flipover );
    }

    // create and display control-links
    if ( c.controls !== 'none' && _items.length > 0 )
    {
      var _lang = _items.parents( '[lang]' ).attr( 'lang' ) || 'en';

      if ( /^(above|both)$/.test( c.controls ) )
      {
        _outer.before( buildControls( c, _lang ).addClass( c.pagingTopClass ) );
      }

      if ( /^(below|both)$/.test( c.controls ) )
      {
        _outer.after( buildControls( c, _lang ).addClass( c.pagingBottomClass ) );
      }

    }

    if ( c.aspect == 'auto' )
    {
      c.aspect = detectAspect( _items ) || // try to determine aspect
                 $.listscroller.aspectDefaults[ c.animation ] ||  // pick default aspect for animation
                 'horizontal';  // final fallback
    }
    _outer.addClass( c.classPrefix + '-' + c.aspect );

    setPos( c, c.startPos || 0, true );

    if(c.autoScrollDelay)
    {
      function nexttrigger ( e ) {
        setPos( c, c.index + c.stepSize );
      }
      scrollInterval = setInterval( nexttrigger, c.autoScrollDelay);
      _block
          .bind('mouseenter', function() {
              clearInterval( scrollInterval );
            })
          .bind('mouseleave', function() {
              scrollInterval = setInterval( nexttrigger, c.autoScrollDelay);
            });
    }

  }


  $.fn.listscroller = function ( config )
  {

    var dc = $.listscroller.defaultConfig;
    if ( (config && config.item) || dc.item )
    {
      this.each(function () {
        var c = $.extend( {}, dc, config ), b = $( this );
        initScroller( c, b, b.find( c.item ) );
      });
    }
    else if (this.length)
    {
      initScroller( $.extend( {}, dc, config ),  this.eq(0).parent(), this );
    }
    return this;

  };

})(jQuery);
