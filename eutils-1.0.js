(function(c,i){var j,k=window,h=document,p=c.browser,q=p.msie,u='tmp_'+(new Date()).getTime()+'_',v=1,r={},w=function(a){return a.replace(/([\\\^\$*+[\]?{}.=!:(|)])/g,'\\$1')};c.extend(c.expr[':'],{childof:function(a,b,d){return c(a.parentNode).is(d[3])},descof:function(a,b,d){while((a=a.parentNode)&&a!==h){if(c(a).is(d[3])){return true}}return false}});var s=function(b,d,f,e){if(!q){e=function(a){a=c.event.fix(a);a.type=b;return c.event.handle.call(this,a)};c.event.special[b]={setup:function(){this.addEventListener(d,e,!!f)},teardown:function(){this.removeEventListener(d,e,!!f)}}}};if(!q){var l=p.mozilla;s('focusin',l?'focus':'DOMFocusIn',l);s('focusout',l?'blur':'DOMFocusOut',l)}var t,m,n,x=function(){var a=m.css('fontSize');if(a!=n){n=a;c(window).trigger('fontresize')}};c.event.special.fontresize={setup:function(){if(this==k||this==h.body){m=c('body');n=m.css('fontSize');t=setInterval(x,500)}},teardown:function(){if(this==k||this==h.body){clearTimeout(t)}}};if(!c.fn.detach){c.fn.detach=function(){return this.each(function(){var a=this.parentNode;a&&a.nodeType==1&&a.removeChild(this)})}}c.fn.extend({if_:function(a){if(c.isFunction(a)){a=a.call(this)}this.if_CondMet=!!a;return this.pushStack(a?this:[])},else_:function(a){var b=this.end();return b.if_CondMet?b.pushStack([]):b.if_(arguments.length?a:1)},fin:function(){return c(this)},pause:function(a,b){return this.animate({smu:0},(a||a===0)?a:800,b)},log:function(){k.console&&console.log(this);return this},zap:function(){return this.each(function(){c(this.childNodes).insertBefore(this)}).remove()},deepest:function(){return this.map(function(){var a=this;while(a.firstChild){a=a.firstChild}return a})},hoverClass:function(b){return this.bind('mouseenter mouseleave',function(a){c(this).toggleClass(b,a.type=='mouseenter')})},run:function(a,b){a.apply(this,b||[]);return this},aquireId:function(){return this.each(function(){c.aquireId(this)}).attr('id')},setFocus:function(){c.setFocus(this[0]);return this},delegate:function(a,b,d,f){return this.bind(b,f,c.delegate(a,d))},scroll:function(a,b){if(a==i&&b==i){return{left:this.scrollLeft(),top:this.scrollTop()}}a!=i&&this.scrollLeft(a);b!=i&&this.scrollTop(b);return this},toggleClasses:function(d,f,e){return this.each(function(){var a=c(this),b=arguments.length>2?e:a.hasClass(d);a.removeClass(b?d:f).addClass(b?f:d)})},lang:function(a){return c.lang(this[0],a)}});c.extend({beget:function(a,b){var d=function(){};d.prototype=a;var f=new d();return b?c.extend(f,b):f},namespace:function(a,b,d,f){var e=k,g,o=0;if(typeof a!='string'){e=a;a=b;b=d;d=f}a=a.split(d||'.');while(g=a[o++]){e=e[g]||(e[g]={})}return b?c.extend(e,b):e},aquireId:function(a){if(!a||!a.id){var b=u+v++;if(!a){return b}if(!a.id){a.id=b}}return a.id},lang:function(a,b){b=b||a===true||a===1;var d=a=(a&&((a.nodeName&&a)||(a.jquery&&a[0])))||h.documentElement;while(!d.lang&&(d.tagName!="HTML")){d=d.parentNode}return(d.lang)?(a.lang=d.lang).substr(0,(b?99:2)).toLowerCase():null},scroll:function(a,b){return c(h).scroll(a,b)},setHash:function(a){a=a.replace(/^#/,'');var b=c('#'+a)[0];if(b){b.id='';j=j||c('<i style="position:absolute;margin:0;visibility:hidden;" id="'+a+'" />');j.css('top',c.scroll().top).appendTo(h.body)}h.location.hash=a;if(b){j[0].id="";b.id=a}},setFocus:function(a){a=c(a);var b='a,input,select,textarea,button,object,area',d=a.is(b)&&a;if(!d){c('*',a).each(function(){if(c(this).is(b)){d=this;return false}})}if(d){var f=c.scroll();c(d).trigger('focus');var e=c.scroll();if(e.top!=f.top){var g=c(a).offset().top-30;if(g<10){g=0}c.scroll({top:g})}}},toInt:function(a,b){return parseInt(a,b||10)},inject:function(a,b){var d=[],f=b.length,e;if(a.indexOf('%{')>-1){if(isNaN(f)){for(e in b){d.push(e)}}else{while(f--){d.push(f)}}e=d.length;while(e--){var g=d[e],o=r[g]||(r[g]=new RegExp(w('%{'+g+'}'),'g'));a=a.replace(o,b[g])}}return a},invSelectors:function(e){e=c.trim(e).replace(/  +/,' ').replace(/ ?> ?/g,'>').replace(/ \)/g,')').replace(/\( /g,'(');var g=[];c.each(e.split(/ ?, ?/),function(a,b){var d='',f=0;b=b.replace(/^>/g,'');while(b=b.replace(/(^| |>)([^ >]*)$/,function(all,p1,p2){d+=p2+((p1==' ')?':descof(':(p1=='>')?':childof(':'');f++;return''})){}g[a]=d+(new Array(f)).join(')')});return g.join(',')},delegate:function(e,g){e=c.invSelectors(e);return function(a){var b=c(a.target),d=b.add(b.parents()),f=d.slice(0,d.index(this)).filter(e)[0];if(f){a.delegate=f;return g.call(this,a)}}}})})(jQuery);
