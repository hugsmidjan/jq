// encoding: utf-8
(function($){var g={item:'.item',container:'',speed:600,easing:'swing',initCallback:function(){},nextBtnTemplate:'<a href="#" class="next"></a>',prevBtnTemplate:'<a href="#" class="prev"></a>',labelNext:'&rarr;',labelPrev:'&larr;',titleNext:'Next panel',titlePrev:'Previous panel'};var h=function(a,b){b.container.stop().animate({scrollLeft:a},b.speed,b.easing,function(){k(b)})};var j=function(b){var c=$('<div class="controls screen"></div>');if(b.numScreens>1){c.append($(b.prevBtnTemplate).html(b.labelPrev).attr('title',b.titlePrev||b.labelPrev||'').click(function(){var a=b.container.scrollLeft()-b.windowSize;a=Math.floor(a/b.windowSize)*b.windowSize;a=(b.wrap&&a<0)?b.maxScroll:Math.max(0,a);b.currentPage+=a==b.maxScroll?b.numScreens-1:-1;h(a,b);return false})).append($(b.nextBtnTemplate).html(b.labelNext).attr('title',b.titleNext||b.labelNext||'').click(function(){var a=b.container.scrollLeft()+b.windowSize;a=Math.ceil(a/b.windowSize)*b.windowSize;a=(b.wrap&&a>b.maxScroll)?0:Math.min(b.maxScroll,a);b.currentPage+=a==0?-b.numScreens+1:1;h(a,b);return false}))}c.append('<div class="direct"></div>');return c};var k=function(a){var b=$('.direct',a.controls);$('span.i',a.controls).removeClass('current').eq(a.currentPage).addClass('current')};$.fn.extend({simpleCarousel:function(f){this.each(function(){var a=$.extend({},g,f);a.handle=$(this);a.handle.addClass('carousel-active');a.container=a.handle.wrap('<div class="container"></div>').parent();a.container.scrollLeft(0);a.windowSize=a.container.width();var b=0;a.items=$(a.item,a.handle).each(function(){b+=$(this).outerWidth()});var c=Math.ceil(b/a.windowSize)*a.windowSize;a.maxScroll=c-a.windowSize;a.numScreens=c/a.windowSize;a.handle.width(c);a.itemsPerPage=Math.ceil(a.items.length/a.numScreens);a.controls=j(a);var d='';for(var i=0;i<a.numScreens;i++){d+='<span class="i"><i>'+(i+1)+'</i></span>'}var e=$('.direct',a.controls).append(d);a.container.after(a.controls);a.currentPage=0;k(a);a.initCallback(a)})}})})(jQuery);