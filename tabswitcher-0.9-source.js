/*
jQuery tabSwitcher Plugin

	* Version 1.0
	* 23.10.2008
	* URL: N/A
	* Description: Privides basic tab functionality in minimal code.
	* Author: Borgar Þorsteinsson
	* Copyright: Copyright (c) 2008 Borgar Þorsteinsson under dual MIT/GPL license.

*//*global
		jQuery
*/

(function ($) {

  var hash = function ( s ) {
        return s.replace(/^.*#([A-Za-z][A-Za-z0-9:._\-]*)$/, '#$1');
      },

      setTab = function ( tab, ln ) {

        tab.find('.current').removeClass('current');
        $( tab.data( 'tabpanes' ) ).hide();
        
        $( hash( ln.attr( 'href' ) ) )
            .show()
            .find('input, a.stream').eq(0)
            .focus();

        var p = ln.parent();
        if ( !p.is('li') ) { p = ln; }
        p.addClass('current');

      };

  $.fn.tabSwitcher = function ( idx ) {
    this.each(function () {

      var tab = $( this ), 
          ls = tab.find('a'),
          re = !tab.hasClass( 'tabs-active' ),
          pn = [];

      if (re) {
        // build links to panels
        for (var i=0; i < ls.length; i++) {
          pn.push( hash( ls[i].href || '#' ) );
        }
        pn = pn.join(', ');
        tab.data( 'tabpanes', pn );
        // add focus links and hide panels
        $( pn ).hide().prepend( '<a href="#" class="stream"></a>' );
      }

      // calling tabSwitcher with an integer selects a tab
      if ( (idx||0) > -1 ) {
        setTab( tab, ls.eq( Math.min( ls.length, idx||0 ) ) );
      }

      if (re) {
        // click event
        tab.click(function( e ){
          var l = $( e.target );
          if ( l.is('a') ) { setTab( $( this ), l ); }
          return false;
        })
        // don't to this twice
        .addClass( 'tabs-active' );
      }

    });
    return this;
  };
  
})(jQuery);