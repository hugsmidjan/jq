(function(d,i){var h,q=window,j=document,m=d.browser,n=m.msie,r='tmp_'+(new Date()).getTime()+'_',s=1,o={},t=function(a){return a.replace(/([\\\^\$*+[\]?{}.=!:(|)])/g,'\\$1')};d.extend(d.expr[':'],{childof:function(a,b,c){return d(a.parentNode).is(c[3])},descof:function(a,b,c){while((a=a.parentNode)&&a!==j){if(d(a).is(c[3])){return true}}return false}});var p=function(c,f,e,g){if(!n){g=function(a){var b=[].slice.call(arguments,0);a=d.event.fix(a);a.type=c;b[0]=a;return d.event.handle.apply(this,b)};d.event.special[c]={setup:function(){this.addEventListener(f,g,!!e)},teardown:function(){this.removeEventListener(f,g,!!e)}}}};if(!n){var k=m.mozilla;p('focusin',k?'focus':'DOMFocusIn',k);p('focusout',k?'blur':'DOMFocusOut',k)}d.fn.extend({if_:function(a){if(d.isFunction(a)){a=a.call(this)}this.if_CondMet=!!a;return this.pushStack(a?this:[])},else_:function(a){var b=this.end();return b.if_CondMet?b.pushStack([]):b.if_(arguments.length?a:1)},fin:function(){return d(this)},pause:function(a,b){return this.animate({smu:0},a||800,b)},run:function(a,b){a.apply(this,b||[]);return this},aquireId:function(){return this.each(function(){d.aquireId(this)})},setFocus:function(a){d.setFocus(this[0],a);return this},delegate:function(a,b,c,f){return this.bind(b,f,d.delegate(a,c))},scroll:function(a,b){if(a==i&&b==i){return{left:this.scrollLeft(),top:this.scrollTop()}}a!=i&&this.scrollLeft(a);b!=i&&this.scrollTop(b);return this},toggleClasses:function(c,f,e){return this.each(function(){var a=d(this),b=arguments.length>2?e:a.hasClass(c);a.removeClass(b?c:f).addClass(b?f:c)})},lang:function(a){return d.lang(this[0],a)}});d.extend({beget:function(a,b){var c=function(){};c.prototype=a;var f=new c();return b?d.extend(f,b):f},namespace:function(a,b,c,f){var e=q,g,l=0;if(typeof a!='string'){e=a;a=b;b=c;c=f}a=a.split(c||'.');while(g=a[l++]){e=e[g]||(e[g]={})}return b?d.extend(e,b):e},aquireId:function(a){if(!a||!a.id){var b=r+s++;if(!a){return b}if(!a.id){a.id=b}}return a.id},lang:function(a,b){b=b||a===true||a===1;var c=a=(a&&((a.nodeName&&a)||(a.jquery&&a[0])))||j.documentElement;while(!c.lang&&(c.tagName!="HTML")){c=c.parentNode}return(c.lang)?(a.lang=c.lang).substr(0,(b?99:2)).toLowerCase():null},scroll:function(a,b){return d(j).scroll(a,b)},setHash:function(a){a=a.replace(/^#/,'');var b=d('#'+a);if(b){b.id='';h=h||d('<i style="position:absolute;visibility:hidden;"></i>')[0];h.id=a;d(h).appendTo(j.body).css('top',d.scroll().top+'px')}document.location.hash=a;if(b){d(h).remove();b.id=a}},setFocus:function(a){a=d(a);var b='a,input,select,textarea,button,object,area',c=a.is(b)&&a;if(!c){d('*',a).each(function(){if(d(this).is(b)){c=this;return false}})}if(c){var f=d.scroll();c.focus();var e=d.scroll();if(e.top!=f.top){var g=d(a).offset().top-30;if(g<10){g=0}d.scroll({top:g})}}},toInt:function(a,b){return parseInt(a,b||10)},inject:function(a,b){var c=[],f=b.length,e;if(a.indexOf('%{')>-1){if(isNaN(f)){for(e in b){c.push(e)}}else{while(f--){c.push(f)}}e=c.length;while(e--){var g=c[e],l=o[g]||(o[g]=new RegExp(t('%{'+g+'}'),'g'));a=a.replace(l,b[g])}}return a},invSelectors:function(e){e=d.trim(e).replace(/  +/,' ').replace(/ ?> ?/g,'>').replace(/ \)/g,')').replace(/\( /g,'(');var g=[];d.each(e.split(/ ?, ?/),function(a,b){var c='',f=0;b=b.replace(/^>/g,'');while(b=b.replace(/(^| |>)([^ >]*)$/,function(all,p1,p2){c+=p2+((p1==' ')?':descof(':(p1=='>')?':childof(':'');f++;return''})){}g[a]=c+(new Array(f)).join(')')});return g.join(',')},delegate:function(e,g){e=d.invSelectors(e);return function(a){var b=d(a.target),c=b.add(b.parents()),f=c.slice(0,c.index(this)).filter(e)[0];if(f){a.delegate=f;return g.call(this,a)}}}})})(jQuery);