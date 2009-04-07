// Attach click event to mp3 files to open in flash media player 

(function ($) {

  $.fn.mediaPlayer = function (cfg) {

    cfg = jQuery.extend({
            //placeholder: null,
            width:       125,
            playerHTML:  '<span class="epmediaplayer"><embed src="%{player}" width="%{width}" height="20" allowscriptaccess="always" allowfullscreen="true" flashvars=playlist=none&amp;height=20&amp;autostart=true" /></span>',
            playerUrl:   (document.location.protocol=='https:' ? 'https://secure.eplica.is/codecentre' : 'http://codecentre.eplica.is') + '/play/audio.swf?file=%{file}',
          }, cfg );

    return this.each(function(){
      
        var _this = this,
            _fileUrl = _this.href.split('?')[0],
            _lastPlayer;
        if (/\.(mp3|aac)$/.test(_fileUrl))
        {
          $(_this).toggle(
            function (e) {
              e.preventDefault();
              if (_lastPlayer)
              {
                _lastPlayer.remove();
              }
              _lastPlayer = $( cfg.playerHTML
                                      .replace('%{width}', cfg.width)
                                      .replace('%{player}', cfg.playerUrl)
                                      .replace('%{file}', _fileUrl)
                                );
              if (cfg.placeholder)
              {
                $(cfg.placeholder).append(_lastPlayer);
              }
              else
              {
                $(_this).after(_lastPlayer);
              }
            },
            function (e) {
              e.preventDefault();
              _lastPlayer.remove();
              _lastPlayer = 0;

            }
          );
        }
        
      });
    
  };

})(jQuery);
