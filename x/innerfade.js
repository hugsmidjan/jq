/* =========================================================

// jquery.innerfade.js

// Datum: 2008-02-14
// Firma: Medienfreunde Hofmann & Baldes GbR
// Author: Torsten Baldes
// Mail: t.baldes@medienfreunde.com
// Web: http://medienfreunde.com

// based on the work of Matt Oakes http://portfolio.gizone.co.uk/applications/slideshow/
// and Ralf S. Engelschall http://trainofthoughts.org/

// ========================================================= */

(function($){$.fn.innerfade=function(a){return this.each(function(){$.innerfade(this,a)})};$.innerfade=function(a,b){var c={'animationtype':'fade','speed':'normal','type':'sequence','timeout':2000,'containerheight':'auto','runningclass':'innerfade','children':null};if(b)$.extend(c,b);if(c.children===null)var d=$(a).children();else var d=$(a).children(c.children);if(d.length>1){$(a).css('position','relative').css('height',c.containerheight).addClass(c.runningclass);for(var i=0;i<d.length;i++){$(d[i]).css('z-index',String(d.length-i)).css('position','absolute').hide()};if(c.type=="sequence"){setTimeout(function(){$.innerfade.next(d,c,1,0)},c.timeout);$(d[0]).show()}else if(c.type=="random"){var e=Math.floor(Math.random()*(d.length));setTimeout(function(){do{f=Math.floor(Math.random()*(d.length))}while(e==f);$.innerfade.next(d,c,f,e)},c.timeout);$(d[e]).show()}else if(c.type=='random_start'){c.type='sequence';var f=Math.floor(Math.random()*(d.length));setTimeout(function(){$.innerfade.next(d,c,(f+1)%d.length,f)},c.timeout);$(d[f]).show()}else{alert('Innerfade-Type must either be \'sequence\', \'random\' or \'random_start\'')}}};$.innerfade.next=function(a,b,c,d){if(b.animationtype=='slide'){$(a[d]).slideUp(b.speed);$(a[c]).slideDown(b.speed)}else if(b.animationtype=='fade'){$(a[d]).fadeOut(b.speed);$(a[c]).fadeIn(b.speed,function(){removeFilter($(this)[0])})}else alert('Innerfade-animationtype must either be \'slide\' or \'fade\'');if(b.type=="sequence"){if((c+1)<a.length){c=c+1;d=c-1}else{c=0;d=a.length-1}}else if(b.type=="random"){d=c;while(c==d)c=Math.floor(Math.random()*a.length)}else alert('Innerfade-Type must either be \'sequence\', \'random\' or \'random_start\'');setTimeout((function(){$.innerfade.next(a,b,c,d)}),b.timeout)}})(jQuery);function removeFilter(a){if(a.style.removeAttribute){a.style.removeAttribute('filter')}}
