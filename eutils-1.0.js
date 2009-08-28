(function(d,k){var l,m=window,i=document,u=d.browser,o=u.msie,z='tmp_'+(new Date()).getTime()+'_',A=1,p=function(){},v={},B=function(a){return a.replace(/([\\\^\$*+[\]?{}.=!:(|)])/g,'\\$1')};d.extend(d.expr[':'],{childof:function(a,b,c){return d(a.parentNode).is(c[3])},descof:function(a,b,c){while((a=a.parentNode)&&a!==i){if(d(a).is(c[3])){return true}}return false},target:function(a,b){return(a.id&&(b=i.location.hash)&&b=='#'+a.id)}});var w=function(b,c,f,e){if(!o){e=function(a){a=d.event.fix(a);a.type=b;return d.event.handle.call(this,a)};d.event.special[b]={setup:function(){this.addEventListener(c,e,!!f)},teardown:function(){this.removeEventListener(c,e,!!f)}}}};if(!o){var n=u.mozilla;w('focusin',n?'focus':'DOMFocusIn',n);w('focusout',n?'blur':'DOMFocusOut',n)}var x,q,r,C=function(){var a=q.css('fontSize');if(a!=r){r=a;d(window).trigger('fontresize')}};d.event.special.fontresize={setup:function(){if(this==m||this==i.body){q=d('body');r=q.css('fontSize');x=setInterval(C,500)}},teardown:function(){if(this==m||this==i.body){clearTimeout(x)}}};if(!d.fn.detach){d.fn.detach=function(){return this.each(function(){var a=this.parentNode;a&&a.nodeType==1&&a.removeChild(this)})}}var y=function(c,f,e,g){var h=[],j=(g?'previous':'next')+'Sibling';c.each(function(){for(var a=this[j],b;a;a=a[j]){b=(a.nodeType==1);if(e||b){if(b&&!d(a).not(f).length){break}h.push(a)}}});return c.pushStack(h)};d.fn.extend({nextUntil:function(a,b){return y(this,a,b)},prevUntil:function(a,b){return y(this,a,b,1)},if_:function(a){if(d.isFunction(a)){a=a.call(this)}this.if_CondMet=!!a;return this.pushStack(a?this:[])},else_:function(a){var b=this.end();return b.if_CondMet?b.pushStack([]):b.if_(arguments.length?a:1)},fin:function(){return d(this)},pause:function(a,b){return this.animate({smu:0},(a||a===0)?a:800,b)},log:function(){m.console&&console.log(this);return this},zap:function(){return this.each(function(){d(this.childNodes).insertBefore(this)}).remove()},deepest:function(){return this.map(function(){var a=this;while(a.firstChild){a=a.firstChild}return a})},hoverClass:function(a){return this.hover(function(){d(this).addClass(a)},function(){d(this).removeClass(a)})},run:function(a,b){var c=a.apply(this,b||[]);return c!==k?c:this},aquireId:function(){return this.each(function(){d.aquireId(this)}).attr('id')},setFocus:function(a){d.setFocus.call(null,this[0],a);return this},delegate:function(a,b,c,f){return this.bind(b,f,d.delegate(a,c))},scroll:function(a,b){if(a==k&&b==k){return{left:this.scrollLeft(),top:this.scrollTop()}}a!=k&&this.scrollLeft(a);b!=k&&this.scrollTop(b);return this},toggleClasses:function(c,f,e){return this.each(function(){var a=d(this),b=arguments.length>2?e:a.hasClass(c);a.removeClass(b?c:f).addClass(b?f:c)})},lang:function(a){return d.lang(this[0],a)}});d.extend({beget:function(a,b){p.prototype=a;return b?d.extend(new p,b):new p},namespace:function(a,b,c,f){var e=m,g,h=0;if(typeof a!='string'){e=a;a=b;b=c;c=f}a=a.split(c||'.');while(g=a[h++]){e=e[g]||(e[g]={})}return b?d.extend(e,b):e},aquireId:function(a){if(!a||!a.id){var b=z+A++;if(!a){return b}if(!a.id){a.id=b}}return a.id},lang:function(a,b){b=b||a===true||a===1;var c=a=(a&&((a.nodeName&&a)||(a.jquery&&a[0])))||i.documentElement;while(!c.lang&&(c.tagName!="HTML")){c=c.parentNode}return(c.lang)?(a.lang=c.lang).substr(0,(b?99:2)).toLowerCase():null},scroll:function(a,b){return d(i).scroll(a,b)},setHash:function(a){a=a.replace(/^#/,'');var b=d('#'+a)[0];if(b){b.id='';l=l||d('<i style="position:absolute;margin:0;visibility:hidden;" id="'+a+'" />');l.css('top',d.scroll().top).appendTo(i.body)}i.location.hash=a;if(b){l[0].id="";b.id=a}},setFocus:function(a,b){a=d(a);var c=',A,INPUT,SELECT,TEXTAREA,BUTTON,OBJECT,AREA,',f=a.is(c)&&a;if(!f){var e=d('*',a),g=b?e.length:0,h=b?-1:1,j;while(j=e[g+=h]){if(c.indexOf(','+j.tagName+',')>-1){f=j;break}}}if(f){var s=d(i);var D=s.scrollTop();d(f).trigger('focus');o&&d(f).trigger('focusin');var E=s.scrollTop();if(E!=D){var t=d(a).offset().top-30;if(t<10){t=0}s.scrollTop(t)}}},toInt:function(a,b){return parseInt(a,b||10)},cropText:function(a,b,c){c=c||'...';var f=a=jQuery.trim(a);if(b&&a.length>b+c.length){var e=b+'~~'+c,g=d.cropText.re||(d.cropText.re={}),h=g[e]||(g[e]=new RegExp('^(.{0,'+b+'}\\s).{'+c.length+',}$'));f=f.replace(/\s\s+/g,' ').replace(h,'$1')}return f+(f.length<a.length?c:'')},inject:function(a,b){var c=[],f=b.length,e;if(a.indexOf('%{')>-1){if(isNaN(f)){for(e in b){c.push(e)}}else{while(f--){c.push(f)}}e=c.length;while(e--){var g=c[e],h=v[g]||(v[g]=new RegExp(B('%{'+g+'}'),'g'));a=a.replace(h,b[g])}}return a},invSelectors:function(e){e=d.trim(e).replace(/  +/,' ').replace(/ ?> ?/g,'>').replace(/ \)/g,')').replace(/\( /g,'(');var g=[];d.each(e.split(/ ?, ?/),function(a,b){var c='',f=0;b=b.replace(/^>/g,'');while(b=b.replace(/(^| |>)([^ >]*)$/,function(all,p1,p2){c+=p2+((p1==' ')?':descof(':(p1=='>')?':childof(':'');f++;return''})){}g[a]=c+(new Array(f)).join(')')});return g.join(',')},delegate:function(e,g){e=d.invSelectors(e);return function(a){var b=d(a.target),c=b.add(b.parents()),f=c.slice(0,c.index(this)).filter(e)[0];if(f){a.delegate=f;return g.call(this,a)}}}})})(jQuery);
