// encoding: utf-8
// ----------------------------------------------------------------------------------
/*
  jQuery tabSwitcher Plugin

  * Version 0.9
  * URL: N/A
  * Description: Privides basic tab functionality in minimal code.
  * Author: Borgar Þorsteinsson
  * Copyright: Copyright (c) 2008 Borgar Þorsteinsson under dual MIT/GPL license.

*//*global
  jQuery
*/

(function ($) {

  var hash = function ( s ) {
        return (/(#.+?)$/.test(s)) ? RegExp.$1 : '';
      },
      setTab = function ( tab, ln, f ) {
        var cf = $.fn.tabSwitcher.config,
            t = $( hash( ln.attr( 'href' ) ) ),
            p = ln.parent();
        ln.trigger( 'switchto.tabSwitcher' );
        tab.find( '.' + cf.current ).removeClass( cf.current );
        $( tab.data( 'tabpanes' ) ).hide();
        t.show();
        if ( f !== false ) t.find('input, a.stream').eq(0).trigger('focus');
        if ( !p.is('li') ) p = ln;
        p.addClass( cf.current );
      };

  $.fn.tabSwitcher = function ( idx ) {
    this.each(function () {

      var tab = $( this ), 
          cf = $.fn.tabSwitcher.config,
          ls = tab.find( cf.linkselector ),
          re = !tab.hasClass( cf.active ),
          pn = [];

      if (re) {
        // build links to panels
        for (var h,i=0; i < ls.length; i++) {
          h = hash( ls[i].href );
          h && pn.push( h );
        }
        if (pn.length) {
          var p = pn.join(', ');
          tab.data( 'tabpanes', p );
          // add focus links and hide panels
          $( p ).hide().prepend( cf.focuslink );  // hide failing?
        }
      }

      // calling tabSwitcher with an integer selects a tab,
      // a negative number selects nothing, 
      // null or undefined selects "current" or first
      if ( idx == null ) {
        idx = ls.index( tab.find('.'+ cf.current +' a') );
        idx = (idx == -1) ? 0 : idx;
      }
      if ( idx > -1 && !(re && !pn.length)) {
        setTab( tab, ls.eq( Math.min( ls.length, idx||0 ) ), !re );
      }

      // don't to this twice
      if (re && pn.length) {
        // click event
        tab
          .find( 'a[href$='+ pn.join('],a[href$=') +']' )
            .bind('click', function( e ){
              var l = $( this );
              if ( l.is('a') ) {
                setTab( l.parents( '.' + cf.active ), l );
              }
              return false;
            })
            .end()
          .addClass( cf.active );
      }

    });
    return this;
  };
  
  $.fn.tabSwitcher.config = {
    linkselector : 'li a[href^=#]',
    focuslink    : '<a href="#" class="stream"></a>',
    active       : 'tabs-active',
    current      : 'current'
  };
  
})(jQuery);
