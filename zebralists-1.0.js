// encoding: utf-8
// $.fn.zebraLists 1.0  -- (c) 2009 Hugsmiðjan ehf. 
(function(c){var i=c.fn.zebraLists=function(a){a=c.extend({},j,a);var f=a.classes||[a.oddClass,a.evenClass];this.each(function(l){var g=c(this),d=-1,h=f.length,k=c.trim(f.join(' ')),e=a.items;if(!h){return false}if(g.is('table')&&/^\s*> tr/.test(e)){e='tbody '+e}g.find(e).each(function(m,b){d++;b=c(b);b.removeClass(k);if(b.is(a.resetItems)){d=-1;return}else if(b.is(a.subItems)){d--}b.addClass(f[d%h])})});return this},j=i.defaults={items:'> tr:visible',subItems:'.subrow',oddClass:'odd'}})(jQuery);
