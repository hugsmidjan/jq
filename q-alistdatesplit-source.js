/* $.fn.alistDateSplit  -- (c) 2009 Hugsmiðjan ehf.  @preserve */
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


(function($) {

  $.alistDateSplit = {
      // https://www.loc.gov/aba/pcc/conser/conserhold/Mosabbr.html
      i18n: {
        en: {
          months: 'January,February,March,April,May,June,July,August,September,October,November,December'.split(','),
          shortMonths: 'Jan.,Feb.,Mar.,Apr.,May,June,July,Aug.,Sept.,Oct.,Nov.,Dec.'.split(','),
          weekdays: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
        },
        //http://malfar.arnastofnun.is/?p=11230
        is: {
          months: 'janúar,febrúar,mars,apríl,maí,júní,júlí,ágúst,september,október,nóvember,desember'.split(','),
          shortMonths: 'jan.,febr.,mars,apr.,maí,júní,júlí,ág.,sept.,okt.,nóv.,des.'.split(','),
          weekdays: 'Sunnudagur,Mánudagur,Þriðjudagur,Miðvikudagur,Fimmtudagur,Föstudagur,Laugardagur'.split(','),
        },
      },
  };

  $.fn.alistDateSplit = function ( cfg ) {

    cfg = $.extend({
              shortMonths:    true, // 1/true uses fyrst 3/4 letters, 0/false uses full month name
              monthAfterDate: true, // 1/true inserts month after date, 0/false before
              dateSel:        '.item .date',
              showWeekday:    false, // 1/true inserts weekday, 'short' uses first 3 letters
              showTime:       false,
              allowRange:     false,
              collapseDupeMonths: true, // "june 12 - 13 2017" instead of "june 1 2017 - june 13 2017"
              rangeSplitter:  /(?:[\s\n]+|)-(?:[\s\n]+|)/g,
              dateSplitter:   /\.|\s+/,
            }, cfg );

    return this.each(function() {

        var alist = $(this);
        var text = $.alistDateSplit.i18n[alist.lang()] || $.alistDateSplit.i18n.en;

        alist.find( cfg.dateSel ).each(function() {
              var dateElm = $(this);
              var dates = dateElm.text().trim().split(cfg.rangeSplitter);
              var jsDate = $('<span class="js-date" />');

              for (var d=0; d<dates.length; d++) {
                var dateObj = dates[d].trim().split(cfg.dateSplitter);
                dates[d] = [new Date(dateObj[2],dateObj[1]-1,dateObj[0]), dateObj[3]];
              }

              for (var i=0; i<dates.length; i++) {
                var date = dates[i][0];
                var dayElm = cfg.allowRange ? $('<span class="day'+ (i+1) +'" />') : jsDate;
                var thisDay = date.getDay();
                var thisDate = date.getDate();
                var thisMonth = date.getMonth();
                var thisYear = date.getFullYear();

                var month = (cfg.shortMonths && text.shortMonths ? text.shortMonths[ thisMonth ].replace('.','<i>.</i>') : text.months[ thisMonth ]) || '';
                var weekday = text.weekdays[ thisDay ] || '';
                // var month = cfg.shortMonths && !text.shortMonths && Amonth.length > 4 ? Amonth.substr(0,3) : Amonth; // legazy
                // var monthDot = cfg.shortMonths && !text.shortMonths && Amonth.length > 4 ? '<i>.</i> ' : ' '; // legazy
                var pendFunc = cfg.monthAfterDate ? 'append' : 'prepend';

                var monthElm = '<span class="m">'+ month + '</span> ';
                var yearElm = '<span class="y">'+ thisYear +'</span> ';
                var timeElm = cfg.showTime && dates[i][1] ? '<span class="t">'+ dates[i][1] +'</span>' : '';
                var weekdayElm = cfg.showWeekday === 'short' ?  '<span class="wd">' + weekday.substr(0,3) + '<i>.</i></span> ' :
                          cfg.showWeekday ? '<span class="wd">' + weekday + '</span> ' :
                          '';

                var prevMonth = (i !== 0 && dates[i-1]) ? dates[i-1][0].getMonth() : null;
                var nextMonth  = (i !== dates.length && dates[i+1]) ? dates[i+1][0].getMonth() : null;
                var nextYear  = (i !== dates.length && dates[i+1]) ? dates[i+1][0].getFullYear() : null;

                // add day
                dayElm.append('<span class="d">'+ thisDate +'<i>.</i></span> ');

                // add month
                if ( !cfg.allowRange || !cfg.collapseDupeMonths || thisYear !== nextYear ) {
                  dayElm[pendFunc](monthElm);
                }
                else {
                  if ( pendFunc === 'prepend' && (i === 0 || thisMonth !== prevMonth) ) {
                    dayElm[pendFunc](monthElm);
                  }
                  else if ( pendFunc === 'append' && (i === dates.length || thisMonth !== nextMonth) ) {
                    dayElm[pendFunc](monthElm);
                  }
                }

                // add year
                if ( !cfg.allowRange ||
                     !cfg.collapseDupeMonths ||
                     (cfg.collapseDupeMonths && (i === dates.length || thisYear !== nextYear)) ) {
                  dayElm.append(yearElm);
                }

                // add weekday
                dayElm.append(timeElm).prepend(weekdayElm);


                if (cfg.allowRange) {
                  // add separator
                  if (i > 0) {
                    jsDate.append('<span class="sep"> - </span>');
                  }

                  jsDate.append(dayElm);
                }
                else {
                  break;
                }
              }


              dateElm.before(jsDate).remove();
          });

        });
  };

})(jQuery);