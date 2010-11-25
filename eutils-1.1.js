// encoding: utf-8
// jQuery extra utilities 1.1  -- (c) 2010 Hugsmiðjan ehf. 
(function(d,j){var l,m=window,i=document,n=i.location,p=d.browser,q=p.msie&&parseInt(p.version,10)<9,A='tmp_'+(new Date()).getTime()+'_',B=1,r=function(){},w={},C=function(a){return a.replace(/([\\\^\$*+[\]?{}.=!:(|)])/g,'\\$1')};d.extend(d.expr[':'],{is:function(a,b,c){return d(a).is(c[3])},childof:function(a,b,c){return d(a.parentNode).is(c[3])},descof:function(a,b,c){while((a=a.parentNode)&&a!==i){if(d(a).is(c[3])){return true}}return false},target:function(a,b){return(a.id&&(b=n.hash)&&b=='#'+a.id)}});if(!q&&!d.event.special.focusin){var x=function(b,c,e,f){if(!q){f=function(a){a=d.event.fix(a);a.type=b;return d.event.handle.call(this,a)};d.event.special[b]={setup:function(){this.addEventListener(c,f,!!e)},teardown:function(){this.removeEventListener(c,f,!!e)}}}};var o=p.mozilla;x('focusin',o?'focus':'DOMFocusIn',o);x('focusout',o?'blur':'DOMFocusOut',o)}var y,s,t,D=function(){var a=s.css('fontSize');if(a!=t){t=a;d(window).trigger('fontresize')}};d.event.special.fontresize={setup:function(){if(this==m||this==i.body){s=d('body');t=s.css('fontSize');y=setInterval(D,500)}},teardown:function(){if(this==m||this==i.body){clearTimeout(y)}}};d.fn.detach=d.fn.detach||function(){return this.each(function(){var a=this.parentNode;a&&a.nodeType==1&&a.removeChild(this)})};var z=function(c,e,f,g){var h=[],k=(g?'previous':'next')+'Sibling';c.each(function(){for(var a=this[k],b;a;a=a[k]){b=(a.nodeType==1);if(f||b){if(b&&!d(a).not(e).length){break}h.push(a)}}});return c.pushStack(h)};d.fn.extend({nextUntil:function(a,b){return z(this,a,b)},prevUntil:function(a,b){return z(this,a,b,1)},'null':function(){return this},if_:function(a){if(d.isFunction(a)){a=a.call(this)}this.if_CondMet=!!a;return this.pushStack(a?this:[])},else_:function(a){var b=this.end();return b.if_CondMet?b.pushStack([]):b.if_(arguments.length?a:1)},fin:function(){return d(this)},shuffle:function(){var a=this,b=a.length;while(b){var c=Math.floor(b*Math.random(b--)),e=a[b];a[b]=a[c];a[c]=e}return a},unhide:function(){return this.css('display','');},pause:function(a,b){return b||!d.fn.delay?this.animate({smu:0},(a||a===0)?a:800,b):this.delay(a)},log:function(){if(m.console){arguments.length&&console.log.call(console,arguments);console.log(this)}return this},zap:function(){return this.each(function(){this.parentNode&&d(this.childNodes).insertBefore(this)}).remove()},deepest:function(){return this.map(function(){var a=this;while(a.firstChild){a=a.firstChild}return a})},hoverClass:function(a){return this.hover(function(){d(this).addClass(a)},function(){d(this).removeClass(a)})},run:function(a,b,c){var e=a.apply(this,b||[]);return(c||e===j)?this:e},aquireId:function(a){return this.each(function(){d.aquireId(this,a)}).attr('id')},setFocus:function(a){this[0]&&d.setFocus.call(null,this[0],a);return this},scroll:function(a,b){if(a==j&&b==j){return{left:this.scrollLeft(),top:this.scrollTop()}}if(a&&(a.top||a.left)){b=a.top;a=a.left}a!=j&&this.scrollLeft(a);b!=j&&this.scrollTop(b);return this},toggleClasses:function(c,e,f){return this.each(function(){var a=d(this),b=arguments.length>2?f:a.hasClass(c);a.removeClass(b?c:e).addClass(b?e:c)})},lang:function(a){return d.lang(this[0],a)}});d.extend({beget:function(a,b){r.prototype=a;return b?d.extend(new r,b):new r},namespace:function(a,b,c,e){var f=m,g,h=0;if(typeof a!='string'){f=a;a=b;b=c;c=e}a=a.split(c||'.');while(g=a[h++]){f=f[g]||(f[g]={})}return b?d.extend(f,b):f},aquireId:function(a,b){if(typeof a=='string'){b=a;a=j}a=d(a||[])[0];if(!a||!a.id){var c=b||A+B++;if(b){var e=b.match(/\d+$/),f=e?parseInt(e[0],10):1;while(d('#'+c)[0]){if(e){b=b.replace(/\d+$/,'');e=j}c=b+(f++)}}if(!a){return c}if(!a.id){a.id=c}}return a.id},getResultBody:function(a){return d('<div/>').append(d(a||[]).not('script,title,meta,link,style').find('script,style').remove().end())},lang:function(a,b){b=b||a===true||a===1;var c=a=(a&&((a.nodeName&&a)||(a.jquery&&a[0])))||i.documentElement;while(!c.lang&&(c.tagName!="HTML")){c=c.parentNode}return(c.lang)?(a.lang=c.lang).substr(0,(b?99:2)).toLowerCase():null},scroll:function(a,b){return d(i).scroll(a,b)},setFrag:function(a,b){a=(a||'').replace(/^#/,'');var c=a&&i.getElementById(a),e=!a&&d.scroll();if(c){c.id='';l=l||d('<i style="position:absolute;margin:0;visibility:hidden;" />');l.attr('id',a).css('top',d.scroll().top).appendTo(i.body)}n.href=n.href.split("#")[0]+'#'+(b?a:d.encodeFrag(a));if(!a){d.scroll(e)}if(c){l[0].id="";c.id=a}},encodeFrag:function(a){return encodeURI(a).replace(/#/g,'%23').replace(/%7C/g,'|')},getFrag:function(a,b){var c=(a||n.href).split('#')[1]||'';return b?c:decodeURIComponent(c)},setFocus:function(a,b){if(a){a=d(a);var c=',A,INPUT,SELECT,TEXTAREA,BUTTON,OBJECT,AREA,',e=c.indexOf(','+a[0].tagName+',')>-1&&a[0];if(!e){var f=d('*',a),g=b?f.length:-1,h=b?-1:1,k;while(k=f[g+=h]){if(c.indexOf(','+k.tagName+',')>-1){e=k;break}}}if(e){var u=d(i);var E=u.scrollTop();d(e).trigger('focus');q&&d(e).trigger('focusin');var F=u.scrollTop();if(F!=E){var v=d(a).offset().top-30;if(v<10){v=0}u.scrollTop(v)}}}},toInt:function(a,b){return parseInt(a,b||10)},cropText:function(a,b,c){c=c||'...';var e=a=d.trim(a);if(b&&a.length>b+c.length){var f=b+'~~'+c,g=d.cropText.re||(d.cropText.re={}),h=g[f]||(g[f]=new RegExp('^(.{0,'+b+'}\\s).{'+c.length+',}$'));e=e.replace(/\s+/g,' ').replace(h,'$1')}return e+(e.length<a.length?c:'')},inject:function(a,b){var c=[],e=b.length,f;if(a.indexOf('%{')>-1){if(isNaN(e)){for(f in b){c.push(f)}}else{while(e--){c.push(e)}}f=c.length;while(f--){var g=c[f],h=w[g]||(w[g]=new RegExp(C('%{'+g+'}'),'g'));a=a.replace(h,b[g])}}return a}});d.setHash=d.setFrag})(jQuery);
