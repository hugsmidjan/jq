// encoding: utf-8
(function(c){var k={item:'.item',container:'',speed:600,easing:'swing',initCallback:function(){},nextBtnTemplate:'<a href="#" class="next"></a>',prevBtnTemplate:'<a href="#" class="prev"></a>',labelNext:'&rarr;',labelPrev:'&larr;',titleNext:'Next panel',titlePrev:'Previous panel'},g=function(a,b){b.container.stop().animate({scrollLeft:a},b.speed,b.easing,function(){h(b)})},l=function(b){var d=c('<div class="controls screen"></div>');if(b.numScreens>1){d.append(c(b.nextBtnTemplate).html(b.labelNext).attr('title',b.titleNext||b.labelNext||'').bind('click',function(){var a=b.container.scrollLeft()+b.windowSize;a=Math.ceil(a/b.windowSize)*b.windowSize;a=(b.wrap&&a>b.maxScroll)?0:Math.min(b.maxScroll,a);b.currentPage+=a==0?-b.numScreens+1:1;g(a,b);return false})).append(c(b.prevBtnTemplate).html(b.labelPrev).attr('title',b.titlePrev||b.labelPrev||'').bind('click',function(){var a=b.container.scrollLeft()-b.windowSize;a=Math.floor(a/b.windowSize)*b.windowSize;a=(b.wrap&&a<0)?b.maxScroll:Math.max(0,a);b.currentPage+=a==b.maxScroll?b.numScreens-1:-1;g(a,b);return false}))}d.append('<div class="direct"></div>');return d},h=function(a){c('span.i',a.controls).removeClass('current').eq(a.currentPage).addClass('current')};c.fn.simpleCarousel=function(m){return this.each(function(){var a=c.extend({},k,m),b=a.handle=c(this),d=a.container=b.wrap('<div class="container"></div>').parent();b.addClass('carousel-active');d.scrollLeft(0);a.windowSize=d.width();var i=0;a.items=c(a.item,b).each(function(){i+=c(this).outerWidth()});var e=Math.ceil(i/a.windowSize)*a.windowSize;a.maxScroll=e-a.windowSize;a.numScreens=e/a.windowSize;b.width(e);a.itemsPerPage=Math.ceil(a.items.length/a.numScreens);a.controls=l(a);var j='';for(var f=0;f<a.numScreens;f++){j+='<span class="i"><i>'+(f+1)+'</i></span>'}c('.direct',a.controls).append(j);d.after(a.controls);a.currentPage=0;h(a);a.initCallback(a)})}})(jQuery);
