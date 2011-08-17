// encoding: utf-8
// ----------------------------------------------------------------------------------
// jQuery.fn.alistDateSplit v 1.0
// ----------------------------------------------------------------------------------
// (c) 2009 Hugsmiðjan ehf  -- http://www.hugsmidjan.is
//  written by:
//   * Valur Sverrisson
// ----------------------------------------------------------------------------------

// Requires:
//  - jQuery 1.4
//  - eutils  (uses: $.lang() )

// splits the articlelist date into spans with month names, requires d.m.yy / 0d.0m.yyyy format
// Usage:
//  - $('.articlelist').alistDateSplit();

(function($){

  var months = {
          en: 'January,February,March,April,May,June,July,August,September,October,November,December'.split(','),
          is: 'janúar,febrúar,mars,apríl,maí,júní,júlí,ágúst,september,október,nóvember,desember'.split(',')
        };

  $.fn.alistDateSplit = function ( cfg ) {

    cfg = $.extend({
              shortMonths:    1, // 1/true uses fyrst 3/4 letters, 0/false uses full month name
              monthAfterDate: 1, // 1/true inserts month after date, 0/false before
              dateSel:        '.item .date'
            }, months, cfg );

    return this.each(function(){

        var alist = $(this),
            monthList = cfg[alist.lang()] || cfg.en;

        alist.find( cfg.dateSel ).each(function(){
              var dateElm = $(this),
                  date = dateElm.text().split('.'),
                  Amonth = monthList[ date[1] - 1 ],
                  month = cfg.shortMonths && Amonth.length > 4 ? Amonth.substr(0,3) : Amonth,
                  monthDot = cfg.shortMonths && Amonth.length > 4 ? '<i>.</i> ' : ' ',
                  jsDate = $('<span class="js-date" />'),
                  pendFunc = cfg.monthAfterDate ? 'append' : 'prepend';

              jsDate.append('<span class="d">'+ date[0] +'<i>.</i></span> ')[pendFunc]('<span class="m">'+ month +'</span>' + monthDot ).append('<span class="y">'+ date[2] +'</span> ');

              dateElm.before(jsDate).remove();
          });

        });
  };

})(jQuery);