// encoding: utf-8
// $.fn.alistDateSplit 1.0  -- (c) 2010 Hugsmiðjan ehf.
(function(b){var h={en:'January,February,March,April,May,June,July,August,September,October,November,December'.split(','),is:'janúar,febrúar,mars,apríl,maí,júní,júlí,ágúst,september,október,nóvember,desember'.split(',')};b.fn.alistDateSplit=function(a){a=b.extend({shortMonths:1,monthAfterDate:1,dateSel:'.item .date'},h,a);return this.each(function(){var d=b(this),e=a[d.lang()]||a.en;d.find(a.dateSel).each(function(){var f=b(this),c=f.text().split('.'),i=a.shortMonths?e[c[1]-1].substr(0,3):e[c[1]-1],j=a.shortMonths?'<i>.</i>':'',g=b('<span class="js-date" />'),k=a.monthAfterDate?'append':'prepend';g.append('<span class="d">'+c[0]+'<i>.</i></span> ')[k]('<span class="m">'+i+'</span> '+j).append('<span class="y">'+c[2]+'</span> ');f.before(g).remove()})})}})(jQuery);