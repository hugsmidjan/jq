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



  $.alistDateSplit = {
      i18n: {
        en: {
          months: 'January,February,March,April,May,June,July,August,September,October,November,December'.split(','),
          weekdays: 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday'.split(',')
        },
        is: {
          months: 'janúar,febrúar,mars,apríl,maí,júní,júlí,ágúst,september,október,nóvember,desember'.split(','),
          weekdays: 'Mánudagur, Þriðjudagur, Miðvikudagur, Fimmtudagur, Föstudagur, Laugardagur, Sunnudagur'.split(',')
        }
      }
  };

(function($){



  $.fn.alistDateSplit = function ( cfg ) {

    cfg = $.extend({
              shortMonths:    1, // 1/true uses fyrst 3/4 letters, 0/false uses full month name
              monthAfterDate: 1, // 1/true inserts month after date, 0/false before
              dateSel:        '.item .date',
              showWeekday:    0 // 1/true inserts weekday, 'short' uses first 3 letters
            }, cfg );

    return this.each(function(){

        var alist = $(this),
            text = $.alistDateSplit.i18n[alist.lang()] || $.alistDateSplit.i18n.en,
            monthList = text.months,
            weekdayList = text.weekdays;

        alist.find( cfg.dateSel ).each(function(){
              var dateElm = $(this),
                  date = dateElm.text().split('.'),
                  Amonth = monthList[ date[1] - 1 ],
                  dateObj = new Date(date[2],date[1],date[0]),
                  weekday = weekdayList[dateObj.getDay()],
                  month = cfg.shortMonths && Amonth.length > 4 ? Amonth.substr(0,3) : Amonth,
                  monthDot = cfg.shortMonths && Amonth.length > 4 ? '<i>.</i> ' : ' ',
                  jsDate = $('<span class="js-date" />'),
                  pendFunc = cfg.monthAfterDate ? 'append' : 'prepend';

              weekday = cfg.showWeekday == 'short' ?  '<span class="wd">' + weekday.substr(0,3) + '<i>.</i></span> ' :
                        cfg.showWeekday ? '<span class="wd">' + weekday + '</span> ' :
                        '';

              jsDate.append('<span class="d">'+ date[0] +'<i>.</i></span> ')[pendFunc]('<span class="m">'+ month + monthDot +'</span>').append('<span class="y">'+ date[2] +'</span> ').prepend(weekday);

              dateElm.before(jsDate).remove();
          });

        });
  };

})(jQuery);