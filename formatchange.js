// $.formatChange  -- (c) 2012 Hugsmiðjan ehf.
(function(b,c,f,g,a,d,h){b.formatChange=function(e,k){if(e=='disengage'){b(c).unbind(f);d&&d.remove();a=d=h}else if(!a){e=e||{};a=b.extend({},k);if(c[g]){b(c).bind(f,function(l,i){if(!d){d=b('<'+(e.tagName||'del')+' style="position:absolute;visibility:hidden;width:0;height:0;overflow:hidden;"/>').appendTo('body')[0];d.id=e.elmId||'mediaformat'}var j=c[g](d,e.before?':before':':after').getPropertyValue('content').replace(/['"]/g,'')||c[g](d,null).getPropertyValue('font-family');if(j!=a.format||i){var m=i?h:a.format;a.format=j;b(c).trigger('formatchange',[a,m])}})}else{b(c).one(f,function(l){a.format=null;b(c).trigger('formatchange',[a])})}}if(a){b(c).trigger(f,[e===true]);return a}}})(jQuery,window,'resize.formatchange','getComputedStyle');