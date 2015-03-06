// $.fn.paginghack -- (c) 2015 Hugsmiðjan ehf.
// Valur Sverrisson

/*
  Usage:
  $('.paging .jump span').pagingHack();
*/

(function($){
    var defaultCfg = {
          pagingSel: 'a,b',
          currentSel: 'b.current',
          pagingSep: '<i>,</i>',
          pages: 10
        };


  $.fn.pagingHack = function(o) {
    var cfg = $.extend(defaultCfg, o);
    return this.each(function() {

      $(this).find('*:not('+ cfg.pagingSel +')').remove();

      var pages = $(this).find(cfg.pagingSel);
      var max = pages.length -1;
      var curIdx = pages.filter(cfg.currentSel).index();

      var pagesBack = Math.max(Math.floor((cfg.pages/2)-1), 0);
      var pagesExtra = cfg.pages - 1;

      var start = (curIdx < pagesBack) ? 0 : curIdx - pagesBack;
      var end = pagesExtra + start;
      end = (max < end) ? max : end;
      var diff = start - end + pagesExtra;
      start -= (start - diff > 0) ? diff : 0;

      pages = pages.clone();

      $(this).empty();
      for(var i=start; i<=end; i++) {
        $(this).append(pages.get(i));
        if (i !== end)
        {
          $(this).append(cfg.pagingSep);
        }
      }
    });
  };
})(jQuery);