// jQuery extra utilities 1.2  -- (c) 2010-2012 Hugsmiðjan ehf.
(function(t,e){var n=window,i=document,r=i.location,s="tmp_"+(new Date).getTime()+"_",o=1,a=function(){},c={};RegExp.escape=RegExp.escape||function(t){return t.replace(/([\\\^\$*+\[\]?{}.=!:(|)])/g,"\\$1")};t.extend(t.expr[":"],{is:function(e,n,i){return t(e).is(i[3])},childof:function(e,n,i){return t(e.parentNode).is(i[3])},descof:function(e,n,r){while((e=e.parentNode)&&e!==i){if(t(e).is(r[3])){return true}}return false},target:function(t,e){return t.id&&(e=r.hash)&&e==="#"+t.id}});var u,l,f,h=function(){var e=l.css("fontSize");if(e!==f){f=e;t(window).trigger("fontresize")}};t.event.special.fontresize={setup:function(){if(this===n||this===i.body){l=t("body");f=l.css("fontSize");u=setInterval(h,500)}},teardown:function(){if(this===n||this===i.body){clearTimeout(u)}}};var p=function(e,n,i,r){var s=[],o=(r?"previous":"next")+"Sibling";e.each(function(){for(var e=this[o],r;e;e=e[o]){r=e.nodeType===1;if(i||r){if(r&&!t(e).not(n).length){break}s.push(e)}}});return e.pushStack(s)};t.fn.extend({nextUntil:function(t,e){return p(this,t,e)},prevUntil:function(t,e){return p(this,t,e,1)},"null":function(){return this},if_:function(e){if(t.isFunction(e)){e=e.call(this)}this.if_CondMet=!!e;return this.pushStack(e?this:[])},else_:function(t){var e=this.end();return e.if_CondMet?e.pushStack([]):e.if_(arguments.length?t:1)},fin:function(){return t(this)},shuffle:function(){var t=this,e=t.length;while(e){var n=Math.floor(e*Math.random(e--)),i=t[e];t[e]=t[n];t[n]=i}return t},imgUnsuppress:function(e){t.imgUnsuppress(this,e);return this},unhide:function(){return this.css("display","")},pause:function(e,n){return!n&&t.fn.delay?this.delay(e):this.animate({smu:0},e||e===0?e:800,n)},log:function(){if(n.console){arguments.length&&console.log.call(console,arguments);console.log(this)}return this},zap:function(){return this.each(function(){this.parentNode&&t(this.childNodes).insertBefore(this)}).remove()},deepest:function(){return this.map(function(){var t=this;while(t.firstChild){t=t.firstChild}return t})},hoverClass:function(e){return this.hover(function(){t(this).addClass(e)},function(){t(this).removeClass(e)})},run:function(t,n,i){var r=t.apply(this,n||[]);return i||r===e?this:r},aquireId:function(e){return this.each(function(){t.aquireId(this,e)}).attr("id")},setFocus:function(){t.setFocus(this[0]);return this},focusHere:function(){t.focusHere(this[0]);return this},scrollPos:function(t,n){if(t==e&&n==e){return{left:this.scrollLeft(),top:this.scrollTop()}}if(t&&(t.top||t.left)){n=t.top;t=t.left}t!=e&&this.scrollLeft(t);n!=e&&this.scrollTop(n);return this},toggleClasses:function(e,n,i){return this.each(function(){var r=t(this),s=arguments.length>2?i:r.hasClass(e);r.removeClass(s?e:n).addClass(s?n:e)})},lang:function(e){return t.lang(this[0],e)}});t.extend({beget:function(e,n){a.prototype=e;return n?t.extend(new a,n):new a},namespace:function(e,i,r,s){var o=n,a,c=0;if(typeof e!=="string"){o=e;e=i;i=r;r=s}e=e.split(r||".");while(a=e[c++]){o=o[a]||(o[a]={})}return i?t.extend(o,i):o},reloadPage:function(t){if(!t||t===r.href){t=t||r.href;var e=!/\?/.test(t)?"?":!/[&?](?:#|$)/.test(t)?"&":"";t=t.replace(/[&?]?(#.*)?$/,e+"$1")}r.replace(t)},winWidth:function(){var t=i.documentElement;return n.innerWidth||t&&t.clientWidth||i.body.clientWidth},aquireId:function(n,i){if(typeof n==="string"){i=n;n=e}n=t(n||[])[0];if(!n||!n.id){var r=i||s+o++;if(i){var a=i.match(/\d+$/),c=a?parseInt(a[0],10):1;while(t("#"+r)[0]){if(a){i=i.replace(/\d+$/,"");a=e}r=i+c++}}if(!n){return r}if(!n.id){n.id=r}}return n.id},cssSupport:function(n,i,r,s,o){return function(a){if(!n){n=t("<div/>")[0];i="Khtml Ms O Moz Webkit".split(" ");s={}}o=a in s?s[a]:a in n.style||e;if(o===e){a=a.replace(/^[a-z]/,function(t){return t.toUpperCase()});r=i.length;while(r--){if(i[r]+a in n.style){o=true;break}}}return s[a]=o||false}}(),getResultBody:function(e,n){var i=t.getResultBody;n=n||{};return t("<div/>").append(t(e||[]).not(n.stripFlat||i.stripFlat||"script,title,meta,link,style").find(n.stripDeep||i.stripDeep||"script,style").remove().end())},escResultHtml:function(e,n){n=n||{};var i=n.tagName||"del",r=" "+(n.tagAttrs||'tagName="'),s=String(e).replace(/<\!DOCTYPE[^>]*>/i,"").replace(/(<\/?)(html|head|body|title|meta|style|link|script)([\s\>])/gi,function(t,e,s,o){s=s.toLowerCase();return n["keep"+s]?e+s+o:e+i+(e==="<"?r+s+'"':"")+o});s=n.keepimgSrc?s:t.imgSuppress(s,n.srcAttr);return s},imgSuppress:function(t,e){return t.replace(/(<img[^>]*? )src=/gi,"$1"+(e||"data-srcAttr")+"=")},imgUnsuppress:function(e,n){n=n||"data-srcAttr";if(typeof e==="string"){e=e.replace(new RegExp("(<img[^>]*? )"+n+"=","gi"),"$1src=")}else{e=t(e);e.find("img").add(e.filter("img")).filter("["+n+"]").each(function(){var e=t(this);e.attr("src",e.attr(n)).removeAttr(n)})}return e},lang:function(e,n){if(typeof e==="boolean"){n=e;e=null}var i=t(e||"html").closest("[lang]").attr("lang")||"";return i?(n?i.substr(0,2):i).toLowerCase():null},scrollPos:function(e,n){return t(i).scrollPos(e,n)},setFrag:function(e,n){e=(e||"").replace(/^#/,"");var s=e&&i.getElementById(e),o=!e&&t.scrollPos();s&&(s.id="");r.href="#"+(n?e:t.encodeFrag(e));!e&&t.scrollPos(o);s&&(s.id=e)},encodeFrag:function(t){return encodeURI(t).replace(/#/g,"%23").replace(/%7C/g,"|")},getFrag:function(t,e){var n=(t||r.href).split("#")[1]||"";return e?n:decodeURIComponent(n)},setFocus:function(e){if(e){e=t(e);var n=",A,INPUT,SELECT,TEXTAREA,BUTTON,OBJECT,AREA,",r=n.indexOf(","+e[0].tagName+",")>-1&&e.is(":visible")&&e[0];if(!r&&e.is(":visible")){e.each(function(e,i){if(n.indexOf(","+i.tagName+",")>-1&&t(i).is(":visible")){r=i;return false}})}if(r){var s=t(i),o=s.scrollTop();t(r)[0].focus();if(s.scrollTop()!==o){var a=t(e).offset().top-30;if(a<10){a=0}s.scrollTop(a)}}}},focusHere:function(n){if(n){n=t(n);if(n.attr("tabindex")==e){n.attr("tabindex",-1)}var r=t(i),s=r.scrollTop();n.trigger("focus");if(r.scrollTop()!==s){var o=t(n).offset().top-30;if(o<10){o=0}r.scrollTop(o)}}},fixSkiplinks:function(){t(document).off("hashchange.fixSkipLinks").on("hashchange.fixSkipLinks",function(){var n=t(r.href.split("#"));if(n[0]){if(n.attr("tabindex")==e){n.attr("tabindex",-1)}n.trigger("focus")}})},toInt:function(t,e){return parseInt(t,e||10)},parseParams:function(n){n=t.trim(n!==e?n:document.location.search).replace(/^[?&]|&$/g,"");var i={};if(n){var r=n.replace(/\+/g," ").split("&"),s=decodeURIComponent,o=0,a=r.length;for(;o<a;o++){var c=r[o].split("="),u=s(c[0]);(i[u]=i[u]||[]).push(s(c[1]||""))}}return i},cropText:function(e,n,i){i=i||" ...";if(n&&e.length>n+i.length){e=t.trim(e).replace(/\s+/g," ");var r=t.cropText.re||(t.cropText.re={}),s=n+"~~"+i,o=r[s]||(r[s]=new RegExp("^(.{0,"+n+"})\\s.+$")),a=e.replace(o,"$1");return a+(a.length<e.length?i:"")}return e},inject:function(t,e){var n=[],i=e.length,r;if(t.indexOf("%{")>-1){if(isNaN(i)){for(r in e){n.push(r)}}else{while(i--){n.push(i)}}r=n.length;while(r--){var s=n[r],o=c[s]||(c[s]=new RegExp(RegExp.escape("%{"+s+"}"),"g"));t=t.replace(o,e[s])}}return t}});t.setHash=t.setFrag;t.scroll=t.scrollPos;t.fn.scroll=t.fn.scrollPos})(jQuery);
