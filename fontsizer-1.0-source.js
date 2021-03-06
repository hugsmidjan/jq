/* jQuery.fn.fontsizer 1.0  -- (c) 2009-2019 Hugsmiðjan ehf.   @preserve */
// ----------------------------------------------------------------------------------
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
//   * Borgar Þorsteinsson  -- http://borgar.undraland.com
// ----------------------------------------------------------------------------------

(function ($) {

  var _body = null,
      _config,

      _applySize = function () {
          _body.className = _body.className.replace( /zoom\d+/, '' ) + ' zoom' + _config.currentSize;
          return false;
        },

      // original allows calling Fontsizer.resize() ... is this important? should we allow it?
      _resize = function ( _newSize ) {
          _config.currentSize = Math.min( _config.maxSize,  Math.max( _newSize,  _config.minSize ) );
          if ($.cookie) // use $.cookie tools if available
          {
            $.cookie(_config.cookie, _config.currentSize, { path: '/', expires: 365 });
          }
          return _applySize();
        };


  $.fn.fontsizer = function ( options ) {
    if ( this.length ) {
      _body = _body || document.body;

      _config = $.extend({
          doClientSide:  !1,  // default: false (rely on server-side functions)
          fontDownSel:   '.dwn a, .dwn button',
          fontUpSel:     '.up a, .dwn button',
          fontJumpSel:   '[class*=fsz] > a',
          minSize:       1,
          maxSize:       3,
          defaultSize:   1,
          currentSize:   1,
          cookie:       'fontSize',
        }, options );

      _config.currentSize = _config.defaultSize;

      if (/\bzoom(\d+)\b/.test( _body.className )) {
        _config.currentSize = parseInt( RegExp.$1, 10 );
      }

      // apply cookie values
      if (_config.doClientSide) {
        var _cookieFontSize = ( $.cookie ) ? parseInt( $.cookie(_config.cookie), 10 ) : 0;
        if (_cookieFontSize) {
          _config.currentSize = Math.min( _config.maxSize,  Math.max( _cookieFontSize, _config.minSize ) );
        }
        _applySize();
      }

      this
          .find( _config.fontUpSel )
              .on('click', function (e) { return _resize( _config.currentSize + 1 ); })
          .end()
          .find( _config.fontDownSel )
              .on('click', function (e) { return _resize( _config.currentSize - 1 ); })
          .end()
          .find( _config.fontJumpSel )
              .each(function () {
                  if ( /(^|\s)fsz(\d+)(\s|$)/.test( this.parentNode.className ) ) {
                    $( this )
                        .data( 'fontsize', parseInt( RegExp.$2, 10 ) )
                        .on('click', function (e) {
                            return _resize( $(this).data('fontsize') );
                          });
                  }
                });
    }
    return this;
  };


})(window.jQuery);
