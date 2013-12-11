// $.fn.columnizor -- (c) 2013 Hugsmiðjan ehf.
// Valur Sverrisson

jQuery(function($){

    var defaultCfg = {
          itemSel: 'li',
          colCount: 3,
          wrap: '<ul class="col" />',
          wrapPend: 'before'
        },
        columnizor = function (elm, cfg) {
            var items = elm.find(cfg.itemSel),
                itmCount = items.length,
                col = $(cfg.wrap),
                itmsPerCol = Math.ceil(itmCount / cfg.colCount);

            // TODO :: Add 'delete' option?
            // elm.data({
            //     itemSel: cfg.itemSel,
            //     wrap: cfg.wrap
            //   });

            items.each(function (i) {
                if (i % itmsPerCol === 0 && i !== 0)
                {
                  elm[cfg.wrapPend](col);
                  col = $(cfg.wrap);
                }

                col.append( $(this) );

                if (i == itmCount-1)
                {
                  elm[cfg.wrapPend](col);
                }
              });

            if ( cfg.wrapPend == 'after' || cfg.wrapPend == 'before' )
            {
              elm.remove();
            }
        };

  $.fn.columnizor = function (cfg) {

    cfg = $.extend(defaultCfg, cfg);
    return this.each(function() {
        columnizor( $(this), cfg );
      });
    };

});
