// encoding: utf-8
// $.fn.delayedHighlight 1.0  -- (c) 2010 Hugsmiðjan ehf.
(function(f,k){f.fn.delayedHighlight=function(a){if(this.length){a=f.extend({className:'focused',delay:500,delayOut:300,cancelOff:'a, area, :input'},a);var g=this,l=a.className,e=!('delegate'in a)?'li':a.delegate,m=a.holes,s=(e?e+' ':'')+m,h='highlight',i=clearTimeout,n,o,b,p;if(a.noBubble){g.bind(h+'on '+h+'off',false)}var q=function(c){if(m&&f(c.target).closest(m,this)[0]){j.call(this,c)}else{var d=f(this);i(n);i(o);(c.type.charAt(0)=='m')&&(p=this);n=setTimeout(function(){if(!b||d[0]!=b[0]){if(b){b.removeClass(l).trigger(h+'off')}b=d;d.addClass(l).trigger(h+'on')}},c.delayOut||a.delay)}},j=function(c){var d=c.type=='click';i(n);i(o);if(!a.sticky||d){(c.type.charAt(0)=='m')&&(p=k);o=setTimeout(function(){if(b&&b[0]!=p||d){b.removeClass(l).trigger(h+'off');b=k}},c.delayOut||a.delayOut)}},r=function(c){var d=(!b||this!=b[0])?q:(a.clickToggles&&!f(c.target).closest(a.cancelOff||'')[0])?j:k;d&&d.call(this,{type:'click',delayOut:1})};if(e){g.delegate(e,'mouseover focusin',q).delegate(e,'mouseout focusout',j);a.click&&g.delegate(e,'click',r)}else{g.bind('mouseover focusin',q).bind('mouseout focusout',j);a.click&&g.bind('click',r)}}return this}})(jQuery);
