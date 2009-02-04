// encoding: utf-8
// Requires jQuery 1.2.6
// Runs OK in 1.3

// todo : set position to list element / page that reports focus
// todo : add a "current" class to paging items
// todo : callback function when animation finishes (see: flash class ?)

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
                        
      initCallback      : function () {},
      moveCallback      : function () {},

      classPrefix       : 'listscroller',
      currentPageClass  : 'current',

      pagingTopClass    : 'paging-top',
      pagingBottomClass : 'paging-bottom',
      pagingTemplate    : '<div class="paging"><ul class="stepper"></ul></div>',
      nextBtnTemplate   : '<li class="next"><a href="#"></a></li>',
      prevBtnTemplate   : '<li class="prev"><a href="#"></a></li>',
      jumpTemplate      : '<li class="jump"></li>',
      jumpLabelTemplate : '<strong></strong>',
      jumpWrapTemplate  : '<span></span>',
      jumpBtnTemplate   : '<a href="#"></a>',

      jumpLabel         : 'Pages:',
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
        conf[prop] = p.left + w[prop]();
        if ( c.wrap == 'loop' && c.lastIndex == 0 && c.index == last ) {
          w[prop]( z.position().left + w[prop]() + z[dimp]() );
          w.animate( conf, c.speed, c.easing );
        }
        else if ( c.wrap == 'loop' && c.lastIndex == last && c.index == 0 ) {
          conf[prop] = z.position().left + z[dimp]() + w[prop]();
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
          if ( nw && !ow ) { // show
            $(this).stop().hide().fadeIn( c.speed );
          }
          else if ( !nw && c.lastIndex == null ) { // init
            $(this).stop().hide();
          }        
          else if ( !nw && ow ) { // hide 
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
          if ( nw && !ow ) { // show
            ac[ap] = 'show';
            $(this).stop().animate( ac, c.speed, c.easing );
          }
          else if ( !nw && c.lastIndex == null ) { // init
            $(this).stop().hide();
          }
          else if ( !nw && ow ) { // hide
            ac[ap] = 'hide';
            $(this).stop().animate( ac, c.speed, c.easing );
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
        if ( i < 0 ) return (c.index == 0) ? m : 0;
        if ( i > m ) return m;
        return i;
      },
      end : function ( i, l, c ) {
        var m = max( l, c );
        if ( i < 0 ) return 0;
        if ( i > m ) return (c.index == m) ? 0 : m;
        return i;
      },
      both : function ( i, l, c ) {
        var m = max( l, c );
        if ( i < 0 ) return (c.index == 0) ? m : 0;
        if ( i > m ) return (c.index == m) ? 0 : m;
        return i;
      },
      random : function ( i, l, c ) {
        return Math.floor( Math.random() * l.length );
      },
      loop : function ( i, l, c ) {
        return ( (l.length + i) % l.length );
      }
    }
    
  };


  function max ( l, c ) {
    return (c.overflow == 'visible') 
        ? Math.floor( l.length / c.stepSize ) * c.stepSize
        : l.length - c.windowSize;
  }
  
  function setPos ( c, _newIndex, _noflash ) {
    
    var _block = c.block;
    var list   = c.list;
    c.lastIndex = c.index;
    c.index = $.listscroller.wrap[ c.wrap || 'none' ]( _newIndex, list, c );

    // todo : mark overflow list items as well
    list
      .addClass( c.hideClass )
      .slice( c.index, c.index + c.windowSize )
        .removeClass( c.hideClass );
    
    if ( $.isFunction( c.moveCallback ) )
      c.moveCallback.call( _block, list, c );
    
    if ( $.isFunction( c.animation ) )
      c.animation.call( _block, list, c )
    else
      $.listscroller.animate[ c.animation||'none' ].call( _block, list, c );
      
    _block
      .removeClass( c.topClass )
      .removeClass( c.bottomClass );
    
    if ( c.index == 0 ) 
      _block.addClass( c.topClass ); 
  
    if ( c.index == list.length - c.windowSize ) 
      _block.addClass( c.bottomClass ); 
    
    // flash the container
    if (!_noflash) {
      _block.addClass( c.classPrefix + '-changed' );
      setTimeout(function () {
        _block.removeClass( c.classPrefix + '-changed' );
      }, c.speed || 1);
    }
    
    // mark paging link if needed
    if ( c.jumps ) {
      c.jumps
        .removeClass( c.currentPageClass )
        .eq( Math.ceil(c.index / c.stepSize) )
          .addClass( c.currentPageClass )
    }

  }
  
  function movePrev ( e ) {
    var c = e.data;
    setPos( c, c.index - c.stepSize );
    return false;
  }
  
  function moveNext ( e ) {
    var c = e.data;
    setPos( c, c.index + c.stepSize );
    return false;
  }
  
  function movePage ( e ) {
    var c = e.data, 
        p = (parseInt( $( this ).text(), 10 ) -1) || 0;
    setPos( c, p * c.stepSize );
    return false;
  }
  
  function buildControls ( c, _lang ) {

    var n = $( c.nextBtnTemplate );
    var p = $( c.prevBtnTemplate );
    var j = $([]);
    var i18n = $.listscroller.i18n;

    n.find( 'a' ).andSelf().eq(0)
      .bind( 'click', c, moveNext )
      .attr( 'title', i18n( c.titleNext, _lang ) )
      .text( i18n( c.labelNext, _lang ) )

    p.find( 'a' ).andSelf().eq(0)
      .bind( 'click', c, movePrev )
      .attr( 'title', i18n( c.titlePrev, _lang ) )
      .text( i18n( c.labelPrev, _lang ) )

    if ( c.paging ) {
      var jmps = []
          page = Math.ceil( c.index / c.stepSize ),
          l = Math.ceil( c.list.length / c.stepSize );
      for (var i=0; i<l; i++) {
        var bt = $( c.jumpBtnTemplate );
        var a = bt.find( 'a' ).andSelf().eq(0)
                  .text( i + 1 ).bind( 'click', c, movePage );
        if (c.index == i) a.addClass( c.currentPageClass );
        jmps.push( a[0] );
      }
      c.jumps = $( jmps );
      
      j = $( c.jumpTemplate );
      j.append(
        $( c.jumpLabelTemplate || [] ).text( i18n( c.jumpLabel, _lang ) ),
        $( c.jumpWrapTemplate  || [] ).append( c.jumps )
      );
    }

    var w  = $( c.pagingTemplate );
    w.map(function(){
        var elem = this;
        while ( elem.firstChild )
          elem = elem.firstChild;
        return elem;
      })
      .append( p, n, j );
    
    return w;
  }


  
  function initScroller ( c, _block, _items ) {
    
    // test and stop repeat inits
    if ( _block.hasClass( c.classPrefix + '-active' ) )
      return false;

    c.list = _items;
    c.block = _block;

    // wrap elements with containers
    var _ref, _inner, _outer;
    if (_items.eq( 0 ).is( 'li' ))
      _inner = _items.parent();
    else
      _inner = _items.wrapAll( '<div />' ).parent();

    _outer = _inner.wrap( '<div />' ).parent();
    _inner.addClass( c.classPrefix + '-clip' );
    _outer.addClass( c.classPrefix + '-wrapper' )
    _block.addClass( c.classPrefix + '-active' );

    // detect aspect 
    if ( c.aspect == 'auto' ) {
      var p1 = _items.eq( 0 ).offset(), 
          p2 = _items.eq( 1 ).offset();
      
      c.aspect = ( p2 && (Math.abs( p2.top - p1.top ) <= Math.abs( p2.left - p1.left )) ) 
            ? 'horizontal' 
            : 'vertical';
    }

    _outer.addClass( c.classPrefix + '-' + c.aspect );
      
    // for circular carousels
    if ( c.wrap == 'loop' ) {
      // generate flipover items
      c.flipover = _items.slice( 0, c.windowSize ).clone( true );
      _items.parent().append( c.flipover );
    }

    setPos( c, c.startPos || 0, true );

    // create and display control-links
    if ( c.controls !== 'none' && _items.length > 0 ) {
      
      var _lang = _items.parents( '[lang]' ).attr( 'lang' ) || 'en';
      
      if ( /^(above|both)$/.test( c.controls ) )
        _outer.before( buildControls( c, _lang ).addClass( c.pagingTopClass ) );

      if ( /^(below|both)$/.test( c.controls ) )
        _outer.after( buildControls( c, _lang ).addClass( c.pagingBottomClass ) );

    }
  }
  
  
  $.fn.listscroller = function ( config ) {

    var dc = $.listscroller.defaultConfig;
    if ( (config && config.item) || dc.item ) {
      this.each(function () {
        var c = $.extend( {}, dc, config ), b = $( this );
        initScroller( c, b, b.find( c.item ) );
      });
    }
    else if (this.length) {
      initScroller( $.extend( {}, dc, config ),  this.eq(0).parent(), this );
    }
    return this;
    
  };
  
})(jQuery);