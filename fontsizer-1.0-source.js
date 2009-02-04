(function ($) {

  var _body = null,
      _config;

      _applySize = function () {
          if (_config.doClientSide) {
            var _cookieFontSize = false;
            if ( $.cookie ) {
              _cookieFontSize = $.cookie('fontSize');
            }
            _cookieFontSize = parseInt( _cookieFontSize, 10 );
            if (_cookieFontSize) {
              _config.currentSize = Math.min( _config.maxSize,  Math.max( _config.minSize, _newSize ) );
            }
          }
          _body.className = _body.className.replace( /zoom\d+/, '' ) + ' zoom' + _config.currentSize;
          return false;
        },

      // original allows calling Fontsizer.resize() ... is this important? should we allow it?
      _resize = function ( _newSize ) {
          _config.currentSize = Math.min( _config.maxSize,  Math.max( _config.minSize, _newSize ) );
          // use $.cookie tools if available
          if ($.cookie) {
            $.cookie('fontSize', _config.currentSize, {
                expires: 365, 
                path: '/'
              });
          }
          return _applySize();
        };


  $.fn.fontsizer = function ( options ) {

    if ( this.length ) {

      _body = _body || document.body;  // speedup further lookups on body

      _config = $.extend({
          doClientSide : false,  // Relies by default on server-side functions.
          fontDownSel  : 'li.dwn a',
          fontUpSel    : 'li.up a',
          minSize      : 1,
          maxSize      : 3,
          defaultSize  : 1,
          currentSize  : 1
        }, options );

      _config.currentSize = _config.defaultSize;

      if (/\bzoom(\d+)\b/.test( _body.className )) {
        _config.currentSize = parseInt( RegExp.$1, 10 );
      }
      
      // apply cookie values
      if (_config.doClientSide) {
        _applySize();
      }

      this
          .find( _config.fontUpSel )
              .click(function (e) { return _resize( _config.currentSize + 1 ); })
          .end()
          .find( _config.fontDownSel )
              .click(function (e) { return _resize( _config.currentSize - 1 ); })
          .end()
          .find( '[class*=fsz] > a' )
              .each(function(){
                  if ( /(^|\s)fsz(\d+)(\s|$)/.test( this.parentNode.className ) ) {
                    $( this )
                        .data( 'fontsize', parseInt( RegExp.$2, 10 ) )
                        .click(function (e) { 
                            return _resize( $(this).data('fontsize') ); 
                          });
                  }
                });
    }
    
    return this;
  };
  
  
})(jQuery);
