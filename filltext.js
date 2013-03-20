// $.fn.txtFill -- (c) 2012 Hugsmiðjan ehf.
// Valur Sverrisson

(function($) {
    var defaultCfg = {
          maxSize: 150,
          minSize: 10
        },
        setFont = function (txtElm, cfg) {
          txtElm.css('font-size', '');

          var maxWidth = txtElm.parent().width(),
              textWidth,
              fontSize,
              lastSize,

              low = parseInt(cfg.minSize, 10),
              high = parseInt(cfg.maxSize, 10);

          while (true)
          {
            fontSize = Math.floor((low + high) / 2);

            if (lastSize == fontSize) {
              return false;
            }

            txtElm.css('font-size', fontSize);
            textWidth = txtElm.width();

            if (textWidth > maxWidth)
            {
              high = fontSize;
            }
            else if (textWidth < maxWidth)
            {
              low = fontSize;
            }

            lastSize = fontSize;
          }
        };

  $.fn.txtFill = function(o) {
    var cfg = $.extend(defaultCfg, o);
    return this.each(function() {
      setFont( $(this), cfg );
    });
  };
})(jQuery);