(function($){var h,_1=window,_0=document,_3=$.browser,_2=_3.msie,_10='tmp_'+(new Date()).getTime()+'_',_9=1,_6={},_8=function(s){return s.replace(/([\\\^\$*+[\]?{}.=!:(|)])/g,'\\$1')};$.extend($.expr[':'],{childof:function(a,i,m){return $(a.parentNode).is(m[3])},descof:function(a,i,m){while((a=a.parentNode)&&a!==document){if($(a).is(m[3])){return true}}return false}});var k=function(a,b,c){_7=function(e){e.type=a;return $.event.handle.apply(this,arguments)};$.event.special[a]={setup:function(){if(_2){return!1}this.addEventListener(b,_7,!!c)},teardown:function(){if(_2){return!1}this.removeEventListener(b,_7,!!c)}}};var n=_3.mozilla&&parseFloat(_3.version)<1.9;k('focusin',n?'focus':'DOMFocusIn',n);k('focusout',n?'blur':'DOMFocusOut',n);$.fn.extend({if_:function(a){if($.isFunction(a)){a=a.call(this)}this.if_CondMet=!!a;return this.pushStack(a?this:[])},else_:function(a){var b=this.end();return b.if_CondMet?b.pushStack([]):b.if_(arguments.length?a:1)},fin:function(){return $(this)},pause:function(a,b){return this.animate({smu:0},a||800,b)},run:function(a,b){a.apply(this,b);return this},aquireId:function(){return this.each(function(){$.aquireId(this)})},setFocus:function(){$.setFocus(this[0]);return this},delegate:function(a,b,c,d){return this.bind(b,d,$.delegate(a,c))},toggleClasses:function(a,b){return this.each(function(){var c=$(this),A=c.hasClass(a);c.removeClass(A?a:b).addClass(A?b:a)})},lang:function(a){return $.lang(this[0],a)}});$.extend({beget:function(a,b){var F=function(){};F.prototype=a;var c=new F();return b?$.extend(c,b):c},namespace:function(a,b,c,_){var d=_1,name,i=0;if(typeof a!='string'){d=a;a=b;b=c;c=_}a=a.split(c||'.');while(name=a[i++]){d=d[name]||(d[name]={})}return b?$.extend(d,b):d},aquireId:function(a){if(!a||!a.id){var b=_10+_9++;if(!a){return b}if(!a.id){a.id=b}}return a.id},lang:function(a,b){b=b||a===true||a===1;var e=a=(a&&((a.nodeName&&a)||(a.jquery&&a[0])))||_0.documentElement;while(!e.lang&&(e.tagName!="HTML")){e=e.parentNode}return(e.lang)?(a.lang=e.lang).substr(0,(b?99:2)).toLowerCase():null},scroll:function(x,y){if(!arguments.length){if(_2){var d=_0.documentElement;if(!d||!d.scrollTop){d=_0.body}x=d.scrollLeft;y=d.scrollTop}else{x=_1.pageXOffset;y=_1.pageYOffset}return{left:x,top:y}}else{if(y===undefined&&typeof x!=='number'){x=x.left;y=x.top}x=(typeof x=='number')?x:$.scroll().left;y=(typeof y=='number')?y:$.scroll().top;_1.scrollTo(x,y)}},setHash:function(a){a=a.replace(/^#/,'');var b=$('#'+a);if(b){b.id='';h=h||$('<i style="position:absolute;visibility:hidden;"></i>')[0];h.id=a;$(h).appendTo(_0.body).css('top',$.scroll().top+'px')}document.location.hash=a;if(b){$(h).remove();b.id=a}},setFocus:function(a){a=$(a);var b=a[0];if(!b.focus){$('*',a).each(function(){if(this.focus){b=this;return false}})}if(b.focus){var c=$.scroll();b.focus();var d=$.scroll();if(d.top!=c.top){var e=$(a).offset().top-30;if(e<10){e=0}$.scroll({top:e})}}},toInt:function(a,b){return parseInt(a,b||10)},inject:function(a,b){var c=[],l=b.length,i;if(a.indexOf('%{')>-1){if(isNaN(l)){for(i in b){c.push(i)}}else{while(l--){c.push(l)}}i=c.length;while(i--){var d=c[i],re=_6[d]||(_6[d]=new RegExp(_8('%{'+d+'}'),'g'));a=a.replace(re,b[d])}}return a},invSelectors:function(f){f=$.trim(f).replace(/  +/,' ').replace(/ ?> ?/g,'>').replace(/ \)/g,')').replace(/\( /g,'(');var g=[];$.each(f.split(/ ?, ?/),function(j,d){var e='',i=0;d=d.replace(/^>/g,'');while(d=d.replace(/(^| |>)([^ >]*)$/,function(a,b,c){e+=c+((b==' ')?':descof(':(b=='>')?':childof(':'');i++;return''})){}g[j]=e+(new Array(i)).join(')')});return g.join(',')},delegate:function(c,d){c=$.invSelectors(c);return function(a){var b=$(a.target),_5=b.add(b.parents()),_4=_5.slice(0,_5.index(this)).filter(c)[0];if(_4){a.delegate=_4;return d.call(this,a)}}}})})(jQuery);