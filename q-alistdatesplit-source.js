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

// splits the articlelist date into spans with month names, requires d.m.yy / 0d.0m.yyyy format. Handles ranges like: d.m.y - d.m.y
// Usage:
//  - $('.articlelist').alistDateSplit();


(function($){

  $.alistDateSplit = {
      i18n: {
        en: {
          months: 'January,February,March,April,May,June,July,August,September,October,November,December'.split(','),
          weekdays: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(',')
        },
        is: {
          months: 'janúar,febrúar,mars,apríl,maí,júní,júlí,ágúst,september,október,nóvember,desember'.split(','),
          weekdays: 'Sunnudagur,Mánudagur,Þriðjudagur,Miðvikudagur,Fimmtudagur,Föstudagur,Laugardagur'.split(',')
        }
      }
  };

  $.fn.alistDateSplit = function ( cfg ) {

    cfg = $.extend({
              shortMonths:    1, // 1/true uses fyrst 3/4 letters, 0/false uses full month name
              monthAfterDate: 1, // 1/true inserts month after date, 0/false before
              dateSel:        '.item .date',
              showWeekday:    0, // 1/true inserts weekday, 'short' uses first 3 letters
              showTime:       0,
              allowRange:     0,
              rangeSplitter:  /-/,
              dateSplitter:   /\.|\s+/
            }, cfg );

    return this.each(function(){

        var alist = $(this),
            text = $.alistDateSplit.i18n[alist.lang()] || $.alistDateSplit.i18n.en;

        alist.find( cfg.dateSel ).each(function(){
              var dateElm = $(this),
                  dates = dateElm.text().split(cfg.rangeSplitter),
                  jsDate = $('<span class="js-date" />');

              for (var i=0; i<dates.length; i++)
              {
                var date = $.trim(dates[i]).split(cfg.dateSplitter),
                    dateObj = new Date(date[2],date[1]-1,date[0]),
                    dayElm = cfg.allowRange ? $('<span class="day'+ (i+1) +'" />') : jsDate,
                    Amonth = text.months[ dateObj.getMonth() ] || '',
                    weekday = text.weekdays[ dateObj.getDay() ] || '',
                    month = cfg.shortMonths && Amonth.length > 4 ? Amonth.substr(0,3) : Amonth,
                    monthDot = cfg.shortMonths && Amonth.length > 4 ? '<i>.</i> ' : ' ',
                    timeStamp = cfg.showTime && date[3] ? '<span class="t">'+ date[3] +'</span>' : '',

                    pendFunc = cfg.monthAfterDate ? 'append' : 'prepend';

                weekday = cfg.showWeekday == 'short' ?  '<span class="wd">' + weekday.substr(0,3) + '<i>.</i></span> ' :
                          cfg.showWeekday ? '<span class="wd">' + weekday + '</span> ' :
                          '';

                dayElm.append('<span class="d">'+ date[0] +'<i>.</i></span> ')[pendFunc]('<span class="m">'+ month + monthDot +'</span>').append('<span class="y">'+ date[2] +'</span> ').append(timeStamp).prepend(weekday);

                if (cfg.allowRange)
                {
                  if (i > 0)
                  {
                    jsDate.append('<span class="sep"> - </span>');
                  }

                  jsDate.append(dayElm);
                }
                else
                {
                  break;
                }
              }


              dateElm.before(jsDate).remove();
          });

        });
  };

})(jQuery);