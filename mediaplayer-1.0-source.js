// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.zebraLists v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Már Örlygsson        -- http://mar.anomy.net
//   * Andri Sigurðsson     
// ----------------------------------------------------------------------------------

// Attach click event to mp3 files to open in flash media player
(function ($) {
  
  var _currentPlayer,
      _currentLink;

  $.fn.mediaPlayer = function (cfg) {
    
    cfg = jQuery.extend({
            //container: null,  // selector or element or jQuery collection or HTML code
            width:       150,
            height:       20, 
            playerUrl:   (document.location.protocol=='https:' ? 'https://secure.eplica.is/codecentre' : 'http://codecentre.eplica.is') + '/play/audio.swf'
          }, cfg );

    function _getPlayerHTML(fileUrl) {
      return flashembed.getHTML({src: cfg.playerUrl, w3c: true, width: cfg.width, height: cfg.height}, { 
        file: fileUrl,
        playlist: 'none',
        allowfullscreen: false,
        allowscriptaccess: 'always',
        autostart: true,
        width: cfg.width,
        height: cfg.height
      });
    };

    return this.each(function(){
      var _this = this,
          _fileUrl = _this.href.split('?')[0],
          _container;
      if (/\.(mp3|aac)$/.test(_fileUrl))
      {
        $(_this).bind('click', function (e) {
          // Remove last player
          if (_currentPlayer)
            _currentPlayer.empty().remove();
          // Toggle
          if (_currentLink == _this)
          {
            _currentPlayer.empty().remove();
            _currentPlayer = null;
            _currentLink = null;
          } else {
            // Container or inline
            if (cfg.container)
            {
              _container = $(cfg.container);
              _currentPlayer = $(_getPlayerHTML(_fileUrl));
              _container.append(_currentPlayer);
            } else {
              _currentPlayer = $('<span class="mediaplayer">'+_getPlayerHTML(_fileUrl)+'</span>');
              _currentPlayer.insertAfter(_this);
            }
            _currentLink = _this;
          }
          e.preventDefault();
        });
      }
    });
  };

})(jQuery);
