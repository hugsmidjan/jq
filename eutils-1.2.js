// encoding: utf-8
// jQuery extra utilities 1.2  -- (c) 2010-2011 Hugsmiðjan ehf.
(function(d,k){var m,l=window,i=document,n=i.location,v='tmp_'+(new Date()).getTime()+'_',w=1,p=function(){},s={},x=function(a){return a.replace(/([\\\^\$*+[\]?{}.=!:(|)])/g,'\\$1')};d.extend(d.expr[':'],{is:function(a,b,c){return d(a).is(c[3])},childof:function(a,b,c){return d(a.parentNode).is(c[3])},descof:function(a,b,c){while((a=a.parentNode)&&a!==i){if(d(a).is(c[3])){return true}}return false},target:function(a,b){return(a.id&&(b=n.hash)&&b=='#'+a.id)}});var t,q,r,y=function(){var a=q.css('fontSize');if(a!=r){r=a;d(window).trigger('fontresize')}};d.event.special.fontresize={setup:function(){if(this==l||this==i.body){q=d('body');r=q.css('fontSize');t=setInterval(y,500)}},teardown:function(){if(this==l||this==i.body){clearTimeout(t)}}};var u=function(c,e,f,g){var h=[],j=(g?'previous':'next')+'Sibling';c.each(function(){for(var a=this[j],b;a;a=a[j]){b=(a.nodeType==1);if(f||b){if(b&&!d(a).not(e).length){break}h.push(a)}}});return c.pushStack(h)};d.fn.extend({nextUntil:function(a,b){return u(this,a,b)},prevUntil:function(a,b){return u(this,a,b,1)},'null':function(){return this},if_:function(a){if(d.isFunction(a)){a=a.call(this)}this.if_CondMet=!!a;return this.pushStack(a?this:[])},else_:function(a){var b=this.end();return b.if_CondMet?b.pushStack([]):b.if_(arguments.length?a:1)},fin:function(){return d(this)},shuffle:function(){var a=this,b=a.length;while(b){var c=Math.floor(b*Math.random(b--)),e=a[b];a[b]=a[c];a[c]=e}return a},unhide:function(){return this.css('display','')},pause:function(a,b){return!b&&d.fn.delay?this.delay(a):this.animate({smu:0},(a||a===0)?a:800,b)},log:function(){if(l.console){arguments.length&&console.log.call(console,arguments);console.log(this)}return this},zap:function(){return this.each(function(){this.parentNode&&d(this.childNodes).insertBefore(this)}).remove()},deepest:function(){return this.map(function(){var a=this;while(a.firstChild){a=a.firstChild}return a})},hoverClass:function(a){return this.hover(function(){d(this).addClass(a)},function(){d(this).removeClass(a)})},run:function(a,b,c){var e=a.apply(this,b||[]);return(c||e===k)?this:e},aquireId:function(a){return this.each(function(){d.aquireId(this,a)}).attr('id')},setFocus:function(){d.setFocus(this[0]);return this},focusHere:function(){d.focusHere(this[0]);return this},scroll:function(a,b){if(a==k&&b==k){return{left:this.scrollLeft(),top:this.scrollTop()}}if(a&&(a.top||a.left)){b=a.top;a=a.left}a!=k&&this.scrollLeft(a);b!=k&&this.scrollTop(b);return this},toggleClasses:function(c,e,f){return this.each(function(){var a=d(this),b=arguments.length>2?f:a.hasClass(c);a.removeClass(b?c:e).addClass(b?e:c)})},lang:function(a){return d.lang(this[0],a)}});d.extend({beget:function(a,b){p.prototype=a;return b?d.extend(new p,b):new p},namespace:function(a,b,c,e){var f=l,g,h=0;if(typeof a!='string'){f=a;a=b;b=c;c=e}a=a.split(c||'.');while(g=a[h++]){f=f[g]||(f[g]={})}return b?d.extend(f,b):f},winWidth:function(){var a=i.documentElement;return l.innerWidth||(a&&a.clientWidth)||i.body.clientWidth},aquireId:function(a,b){if(typeof a=='string'){b=a;a=k}a=d(a||[])[0];if(!a||!a.id){var c=b||v+w++;if(b){var e=b.match(/\d+$/),f=e?parseInt(e[0],10):1;while(d('#'+c)[0]){if(e){b=b.replace(/\d+$/,'');e=k}c=b+(f++)}}if(!a){return c}if(!a.id){a.id=c}}return a.id},getResultBody:function(a,b){var c=d.getResultBody;b=b||{};return d('<div/>').append(d(a||[]).not(b.stripFlat||c.stripFlat||'script,title,meta,link,style').find(b.stripDeep||c.stripDeep||'script,style').remove().end())},escResultHtml:function(f,g){g=g||{};var h=g.tagName||'del',j=' '+(g.tagAttrs||'tagName="'),o=String(f).replace(/<\!DOCTYPE[^>]*>/i,'').replace(/(<\/?)(html|head|body|title|meta|style|link|script)([\s\>])/gi,function(a,b,c,e){c=c.toLowerCase();return g['keep'+c]?b+c+e:b+h+((b=='<')?j+c+'"':'')+e});o=g.keepimgSrc?o:d.imgSuppress(o,g.srcAttr);return o},imgSuppress:function(a,b){return a.replace(/(<img[^>]*? )src=/gi,'$1'+(b||'data-srcAttr')+'=')},imgUnsuppress:function(c,e){e=e||'data-srcAttr';if(typeof c=='string'){c=c.replace(new RegExp('(<img[^>]*? )'+e+'=','gi'),'$1src=')}else{c=d(c);c.find('img').add(c.filter('img')).attr('src',function(){var a=d(this),b=a.attr(e);a.removeAttr(e);return b})}return c},lang:function(a,b){if(a===!0||a===!1){b=a;a=null}var c=d(a||'html').closest('[lang]').attr('lang')||'';return c?(b?c.substr(0,2):c).toLowerCase():null},scroll:function(a,b){return d(i).scroll(a,b)},setFrag:function(a,b){a=(a||'').replace(/^#/,'');var c=a&&i.getElementById(a),e=!a&&d.scroll();if(c){c.id='';m=m||d('<i style="position:absolute;margin:0;visibility:hidden;" />');m.attr('id',a).css('top',d.scroll().top).appendTo(i.body)}n.href=n.href.split("#")[0]+'#'+(b?a:d.encodeFrag(a));if(!a){d.scroll(e)}if(c){m[0].id="";c.id=a}},encodeFrag:function(a){return encodeURI(a).replace(/#/g,'%23').replace(/%7C/g,'|')},getFrag:function(a,b){var c=(a||n.href).split('#')[1]||'';return b?c:decodeURIComponent(c)},setFocus:function(c){if(c){c=d(c);var e=',A,INPUT,SELECT,TEXTAREA,BUTTON,OBJECT,AREA,',f=e.indexOf(','+c[0].tagName+',')>-1&&c.is(':visible')&&c[0];if(!f&&c.is(':visible')){c.each(function(a,b){if(e.indexOf(','+b.tagName+',')>-1&&d(b).is(':visible')){f=b;return false}})}if(f){var g=d(i),h=g.scrollTop();d(f)[0].focus();if(g.scrollTop()!=h){var j=d(c).offset().top-30;if(j<10){j=0}g.scrollTop(j)}}}},focusHere:function(a){if(a){a=d(a);var b=a.attr('tabindex');if(b==k){a.attr('tabindex',-1)}var c=d(i),e=c.scrollTop();a.trigger('focus');if(c.scrollTop()!=e){var f=d(a).offset().top-30;if(f<10){f=0}c.scrollTop(f)}}},fixSkiplinks:function(c){d(document).delegate(c||'a[href^="#"]','click',function(a){if(!a.isDefaultPrevented()){var b=d(this).attr("href").substr(1);if(b){d('#'+b).focusHere();a.preventDefault()}}})},toInt:function(a,b){return parseInt(a,b||10)},parseParams:function(a){a=d.trim(a!=k?a:document.location.search).replace(/^[?&]|&$/g,'');var b={};if(a){var c=a.replace(/\+/g,' ').split('&'),e=decodeURIComponent,f=0,g=c.length;for(;f<g;f++){var h=c[f].split('='),j=e(h[0]);(b[j]=b[j]||[]).push(e(h[1]||''))}}return b},cropText:function(a,b,c){c=c||' ...';if(b&&a.length>b+c.length){a=d.trim(a).replace(/\s+/g,' ');var e=d.cropText.re||(d.cropText.re={}),f=b+'~~'+c,g=e[f]||(e[f]=new RegExp('^(.{0,'+b+'})\\s.+$')),h=a.replace(g,'$1');return h+(h.length<a.length?c:'')}return a},inject:function(a,b){var c=[],e=b.length,f;if(a.indexOf('%{')>-1){if(isNaN(e)){for(f in b){c.push(f)}}else{while(e--){c.push(e)}}f=c.length;while(f--){var g=c[f],h=s[g]||(s[g]=new RegExp(x('%{'+g+'}'),'g'));a=a.replace(h,b[g])}}return a}});d.setHash=d.setFrag})(jQuery);
