// $.formatChange  -- (c) 2012 Hugsmiðjan ehf.
(function(c,f,g,h,a,d,i,l){h=f.getComputedStyle;c.formatChange=function(b,j){if(b==='disengage'){c(f).unbind(g);d&&d.remove();a=d=l}else if(!a){b=c.extend({S:{'narrow':1,'mobile':1}},b);a=c.extend({},j);c(f).bind(g,function(n,m){if(!d){i=c('<'+(b.tagName||'del')+' style="position:absolute;visibility:hidden;width:0;height:0;overflow:hidden;">f</del>').appendTo('body');d=i[0];d.id=b.elmId||'mediaformat'}var e=m?l:a.format,k=(h&&h(d,b.before?':before':':after').getPropertyValue('content').replace(/['"]/g,''))||i.css('font-family');if((k!==e)||m){a.format=k;a.lastFormat=e;if(b.S&&!(j&&j.isSmall)){a.isSmall=b.S[k];a.isLarge=!a.isSmall;a.wasSmall=e&&b.S[e];a.wasLarge=e&&!a.wasSmall;a.becameSmall=a.isSmall&&!a.wasSmall;a.becameLarge=a.isLarge&&!a.wasLarge}c(f).trigger('formatchange',[a,e])}})}if(a){c(f).trigger(g,[b===true]);return a}}})(jQuery,window,'resize.formatchange');
