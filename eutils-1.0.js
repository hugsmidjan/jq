(function(d,i){var j,k=window,h=document,p=d.browser,q=p.msie,u='tmp_'+(new Date()).getTime()+'_',v=1,r={},w=function(a){return a.replace(/([\\\^\$*+[\]?{}.=!:(|)])/g,'\\$1')};d.extend(d.expr[':'],{childof:function(a,b,c){return d(a.parentNode).is(c[3])},descof:function(a,b,c){while((a=a.parentNode)&&a!==h){if(d(a).is(c[3])){return true}}return false}});var s=function(b,c,f,e){if(!q){e=function(a){a=d.event.fix(a);a.type=b;return d.event.handle.call(this,a)};d.event.special[b]={setup:function(){this.addEventListener(c,e,!!f)},teardown:function(){this.removeEventListener(c,e,!!f)}}}};if(!q){var l=p.mozilla;s('focusin',l?'focus':'DOMFocusIn',l);s('focusout',l?'blur':'DOMFocusOut',l)}var t,m,n,x=function(){var a=m.css('fontSize');if(a!=n){n=a;d(window).trigger('fontresize')}};d.event.special.fontresize={setup:function(){if(this==k||this==h.body){m=d('body');n=m.css('fontSize');t=setInterval(x,500)}},teardown:function(){if(this==k||this==h.body){clearTimeout(t)}}};if(!d.fn.detach){d.fn.detach=function(){return this.each(function(){var a=this.parentNode;a&&a.nodeType==1&&a.removeChild(this)})}}d.fn.extend({if_:function(a){if(d.isFunction(a)){a=a.call(this)}this.if_CondMet=!!a;return this.pushStack(a?this:[])},else_:function(a){var b=this.end();return b.if_CondMet?b.pushStack([]):b.if_(arguments.length?a:1)},fin:function(){return d(this)},pause:function(a,b){return this.animate({smu:0},(a||a===0)?a:800,b)},log:function(){k.console&&console.log(this);return this},zap:function(){return this.each(function(){d(this.childNodes).insertBefore(this)}).remove()},deepest:function(){return this.map(function(){var a=this;while(a.firstChild){a=a.firstChild}return a})},hoverClass:function(b){return this.bind('mouseenter mouseleave',function(a){d(this).toggleClass(b,a.type=='mouseenter')})},run:function(a,b){var c=a.apply(this,b||[]);return c!==i?c:this},aquireId:function(){return this.each(function(){d.aquireId(this)}).attr('id')},setFocus:function(){d.setFocus(this[0]);return this},delegate:function(a,b,c,f){return this.bind(b,f,d.delegate(a,c))},scroll:function(a,b){if(a==i&&b==i){return{left:this.scrollLeft(),top:this.scrollTop()}}a!=i&&this.scrollLeft(a);b!=i&&this.scrollTop(b);return this},toggleClasses:function(c,f,e){return this.each(function(){var a=d(this),b=arguments.length>2?e:a.hasClass(c);a.removeClass(b?c:f).addClass(b?f:c)})},lang:function(a){return d.lang(this[0],a)}});d.extend({beget:function(a,b){var c=function(){};c.prototype=a;var f=new c();return b?d.extend(f,b):f},namespace:function(a,b,c,f){var e=k,g,o=0;if(typeof a!='string'){e=a;a=b;b=c;c=f}a=a.split(c||'.');while(g=a[o++]){e=e[g]||(e[g]={})}return b?d.extend(e,b):e},aquireId:function(a){if(!a||!a.id){var b=u+v++;if(!a){return b}if(!a.id){a.id=b}}return a.id},lang:function(a,b){b=b||a===true||a===1;var c=a=(a&&((a.nodeName&&a)||(a.jquery&&a[0])))||h.documentElement;while(!c.lang&&(c.tagName!="HTML")){c=c.parentNode}return(c.lang)?(a.lang=c.lang).substr(0,(b?99:2)).toLowerCase():null},scroll:function(a,b){return d(h).scroll(a,b)},setHash:function(a){a=a.replace(/^#/,'');var b=d('#'+a)[0];if(b){b.id='';j=j||d('<i style="position:absolute;margin:0;visibility:hidden;" id="'+a+'" />');j.css('top',d.scroll().top).appendTo(h.body)}h.location.hash=a;if(b){j[0].id="";b.id=a}},setFocus:function(a){a=d(a);var b='a,input,select,textarea,button,object,area',c=a.is(b)&&a;if(!c){d('*',a).each(function(){if(d(this).is(b)){c=this;return false}})}if(c){var f=d.scroll();d(c).trigger('focus');var e=d.scroll();if(e.top!=f.top){var g=d(a).offset().top-30;if(g<10){g=0}d.scroll({top:g})}}},toInt:function(a,b){return parseInt(a,b||10)},inject:function(a,b){var c=[],f=b.length,e;if(a.indexOf('%{')>-1){if(isNaN(f)){for(e in b){c.push(e)}}else{while(f--){c.push(f)}}e=c.length;while(e--){var g=c[e],o=r[g]||(r[g]=new RegExp(w('%{'+g+'}'),'g'));a=a.replace(o,b[g])}}return a},invSelectors:function(e){e=d.trim(e).replace(/  +/,' ').replace(/ ?> ?/g,'>').replace(/ \)/g,')').replace(/\( /g,'(');var g=[];d.each(e.split(/ ?, ?/),function(a,b){var c='',f=0;b=b.replace(/^>/g,'');while(b=b.replace(/(^| |>)([^ >]*)$/,function(all,p1,p2){c+=p2+((p1==' ')?':descof(':(p1=='>')?':childof(':'');f++;return''})){}g[a]=c+(new Array(f)).join(')')});return g.join(',')},delegate:function(e,g){e=d.invSelectors(e);return function(a){var b=d(a.target),c=b.add(b.parents()),f=c.slice(0,c.index(this)).filter(e)[0];if(f){a.delegate=f;return g.call(this,a)}}}})})(jQuery);
