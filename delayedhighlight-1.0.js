// encoding: utf-8
// $.fn.delayedHighlight 1.0  -- (c) 2010 Hugsmiðjan ehf.
(function(h,l){h.fn.delayedHighlight=function(a){if(this.length){a=h.extend({className:'focused',delay:500,delayOut:300,cancelOff:'a, area, :input'},a);var i=this,m=a.className,g=!('delegate'in a)?'li':a.delegate,n=a.holes,w=(g?g+' ':'')+n,d='highlight',s='mouseover focusin',t='mouseout focusout',u='isDefaultPrevented',j=clearTimeout,o,p,b,q;if(a.noBubble){i.bind(d+'on '+d+'off',false)}var r=function(c){if(n&&h(c.target).closest(n,this)[0]){k.call(this,c)}else{var e=h(this);j(o);j(p);(c.type.charAt(0)=='m')&&(q=this);o=setTimeout(function(){if(!b||e[0]!=b[0]){var f=jQuery.Event('before'+d+'on');e.trigger(f);if(!f[u]()){if(b){b.removeClass(m).trigger(d+'off')}b=e;e.addClass(m).trigger(d+'on')}}},c.delayOut||a.delay)}},k=function(c){var e=c.type=='click';j(o);j(p);if(!a.sticky||e){(c.type.charAt(0)=='m')&&(q=l);p=setTimeout(function(){if(b&&b[0]!=q||e){var f=jQuery.Event('before'+d+'off');b.trigger(f);if(!f[u]()){b.removeClass(m).trigger(d+'off');b=l}}},c.delayOut||a.delayOut)}},v=function(f){var c=(!b||this!=b[0])?r:(a.clickToggles&&!h(f.target).closest(a.cancelOff||'')[0])?k:l;c&&c.call(this,{type:'click',delayOut:1})};if(g){i.delegate(g,s,r).delegate(g,t,k);a.click&&i.delegate(g,'click',v)}else{i.bind(s,r).bind(t,k);a.click&&i.bind('click',v)}}return this}})(jQuery);
