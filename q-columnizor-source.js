// $.fn.columnizor -- (c) 2013 Hugsmiðjan ehf.
// Valur Sverrisson

(function($){

    var defaultCfg = {
          itemSel: 'li', // String - items to group
          colCount: 3, // Int - number of columns
          colWrap: '<ul class="col" />', // column wrap markup
          wrapPend: 'before' // String - where to put the columns "(after, append, before, prepend)"
        },
        columnizor = function (elm, cfg) {
            var items = elm.find(cfg.itemSel),
                itmCount = items.length,
                col = $(cfg.colWrap),
                itmsPerCol = Math.ceil(itmCount / cfg.colCount);

            // TODO :: Add 'destroy' option?
            // elm.data({
            //     itemSel: cfg.itemSel,
            //     colWrap: cfg.colWrap
            //   });

            items.each(function (i) {
                if (i % itmsPerCol === 0 && i !== 0)
                {
                  elm[cfg.wrapPend](col);
                  col = $(cfg.colWrap);
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

})(jQuery);
