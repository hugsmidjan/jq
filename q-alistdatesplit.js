// $.fn.alistDateSplit 1.0  -- (c) 2010 Hugsmiðjan ehf.
(function(a){a.alistDateSplit={i18n:{en:{months:'January,February,March,April,May,June,July,August,September,October,November,December'.split(','),weekdays:'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(',')},is:{months:'janúar,febrúar,mars,apríl,maí,júní,júlí,ágúst,september,október,nóvember,desember'.split(','),weekdays:'Sunnudagur,Mánudagur,Þriðjudagur,Miðvikudagur,Fimmtudagur,Föstudagur,Laugardagur'.split(',')}}};a.fn.alistDateSplit=function(b){b=a.extend({shortMonths:1,monthAfterDate:1,dateSel:'.item .date',showWeekday:0},b);return this.each(function(){var f=a(this),g=a.alistDateSplit.i18n[f.lang()]||a.alistDateSplit.i18n.en;f.find(b.dateSel).each(function(){var h=a(this),c=h.text().split('.'),i=new Date(c[2],c[1]-1,c[0]),d=g.months[i.getMonth()],e=g.weekdays[i.getDay()],k=b.shortMonths&&d.length>4?d.substr(0,3):d,l=b.shortMonths&&d.length>4?'<i>.</i> ':' ',j=a('<span class="js-date" />'),m=b.monthAfterDate?'append':'prepend';e=b.showWeekday=='short'?'<span class="wd">'+e.substr(0,3)+'<i>.</i></span> ':b.showWeekday?'<span class="wd">'+e+'</span> ':'';j.append('<span class="d">'+c[0]+'<i>.</i></span> ')[m]('<span class="m">'+k+l+'</span>').append('<span class="y">'+c[2]+'</span> ').prepend(e);h.before(j).remove()})})}})(jQuery);