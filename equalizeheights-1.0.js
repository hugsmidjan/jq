// $.fn.equalizeHeights 1.0  -- (c) 2009-2012 Hugsmiðjan ehf.
(function(b,k,z){var l=b.browser,q=!!l.msie&&parseInt(l.version,10)<9,A=q&&(parseInt(l.version,10)<7||document.compatMode==='BackCompat'),r=(A)?'height':'min-height',i='box-sizing',m=0,n=0,j={},o={},s,t,u=function(){if(!s){clearTimeout(t);t=setTimeout(v,100)}},v=function(){s=1;for(var g in j){w(j[g],o[g].margins)}setTimeout(function(){s=0},0)},w=function(f,B){var x=b(f).filter(':visible');if(x.length){var p=0,y=[];x.each(function(g){var c=b(this);c.css(r,'');var d=c.outerHeight(),h=0,a,e=b.fn.jquery.substr(0,3)>=1.8;if(B){h=(parseInt(c.css('margin-top'),10)||0)+(parseInt(c.css('margin-bottom'),10)||0)}if(q){if(e){a=c.css(i)}else{a=c.data('cache-'+i);if(!a){a=c.css(i)||c.css((l.mozilla?'-moz-':'')+i);c.data('cache-'+i,a||'x')}}}y[g]=(q||a!=='border-box')?h+d-c.height():h;p=Math.max(d,p)}).each(function(g){b(this).css(r,p-y[g]+0.5)}).triggerHandler('equalizeheights',p);document.body.className+=''}};b.fn.equalizeHeights=function(a){var e=this,f;if(a==='destroy'){e.each(function(g){var c=b(this);f=c.data(k);var d=j[f];if(d){var h=b.inArray(this,d);if(h>-1){c.removeData(k).css(r,'');d.splice(h,1);if(d.length===1&&b.inArray(d[0],e.slice(g))<0){b(d).equalizeHeights('destroy')}else if(!d.length){delete j[f];delete o[f];n--}if(!n){b(window).unbind('.eqh')}}}})}else if(e.length>1){f=e.data(k);a=a==='refresh'?o[f]:a&&a.$$done?a:b.extend({$$done:1},(typeof a==='boolean')?{margins:a}:a||{});if(a){if(!n){b(window).bind('resize.eqh',u).bind('load.eqh fontresize.eqh',v)}if(!a.onceOnly&&f==z){e.data(k,m);j[m]=e.toArray();o[m]=a;n++;m++}w(e,a.margins)}}return e};b.equalizeHeights=u})(jQuery,'eqh_setId');
