// Attach click event to mp3 files to open in flash media player 

(function ($) {

  $.fn.mediaPlayer = function (cfg) {

    cfg = jQuery.extend({
            //container: null,  // selector or element or jQuery collection or HTML code
            // FIXME: playerHTML �yrfti a� hverfa og nota flashEmbed() � sta�inn.. og m�gulega koma �essari width breytu inn me� heppilegri h�tti
            width:       125,
            playerHTML:  '<embed src="%{player}" width="%{width}" height="20" allowscriptaccess="always" allowfullscreen="true" flashvars="playlist=none&amp;height=20&amp;autostart=true" />',
            playerUrl:   (document.location.protocol=='https:' ? 'https://secure.eplica.is/codecentre' : 'http://codecentre.eplica.is') + '/play/audio.swf?file=%{file}',
          }, cfg );

    return this.each(function(){
      
        var _this = this,
            _fileUrl = _this.href.split('?')[0];

        if (/\.(mp3|aac)$/.test(_fileUrl))
        {
          var _container = $(cfg.container || '<span class="mediaplayer" />')
              _containerSibling = $(_container[0].previousSibling || document.body.lastChild),
              // FIXME: playerHTML �yrfti a� hverfa og nota flashEmbed() � sta�inn.. og m�gulega koma �essari width breytu inn me� heppilegri h�tti
              _thePlayer = $( cfg.playerHTML
                                      .replace('%{width}', cfg.width)
                                      .replace('%{player}', cfg.playerUrl)
                                      .replace('%{file}', _fileUrl)
                                );

          $(_this).bind('click', function (e) {
              // Toggle player
              if (_thePlayer.parent())
              {
                _thePlayer.remove();
              }
              else
              {
                _thePlayer.insertAfter(_containerSibling);
              }
              e.preventDefault();
            });
        }
        
      });
    
  };

})(jQuery);
