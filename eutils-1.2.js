// jQuery extra utilities 1.2  -- (c) 2010-2013 Hugsmiðjan ehf.
(function(t,e,n){var i=window,r=e,s=r.location,o="tmp_"+(new Date).getTime()+"_",a=1,f={};RegExp.escape=RegExp.escape||function(t){return t.replace(/([\\\^\$*+\[\]?{}.=!:(|)])/g,"\\$1")};t.extend(t.expr[":"],{is:function(e,n,i){return t(e).is(i[3])},childof:function(e,n,i){return t(e.parentNode).is(i[3])},descof:function(e,n,i){while((e=e.parentNode)&&e!==r){if(t(e).is(i[3])){return true}}return false},target:function(t,e){return t.id&&(e=s.hash)&&e==="#"+t.id}});var c,u,l,h=function(){var e=u.css("fontSize");if(e!==l){l=e;t(window).trigger("fontresize")}};t.event.special.fontresize={setup:function(){if(this===i||this===r.body){u=t("body");l=u.css("fontSize");c=setInterval(h,500)}},teardown:function(){if(this===i||this===r.body){clearTimeout(c)}}};var p=function(e,n,i,r){var s=[],o=(r?"previous":"next")+"Sibling";e.each(function(){for(var e=this[o],r;e;e=e[o]){r=e.nodeType===1;if(i||r){if(r&&!t(e).not(n).length){break}s.push(e)}}});return e.pushStack(s)};t.fn.extend({nextUntil:function(t,e){return p(this,t,e)},prevUntil:function(t,e){return p(this,t,e,1)}});t.fn.unhide=function(){return this.css("display","")};t.fn.extend({"null":function(){return this},if_:function(e){if(t.isFunction(e)){e=e.call(this)}this.if_CondMet=!!e;return this.pushStack(e?this:[])},else_:function(t){var e=this.end();return e.if_CondMet?e.pushStack([]):e.if_(arguments.length?t:1)},fin:function(){return t(this)},shuffle:function(){var t=this,e=t.length;while(e){var n=Math.floor(e*Math.random(e--)),i=t[e];t[e]=t[n];t[n]=i}return t},imgUnsuppress:function(e){t.imgUnsuppress(this,e);return this},pause:function(e,n){return!n&&t.fn.delay?this.delay(e):this.animate({smu:0},e||e===0?e:800,n)},log:function(){if(i.console){arguments.length&&console.log.call(console,arguments);console.log(this)}return this},zap:function(){return this.each(function(){this.parentNode&&t(this.childNodes).insertBefore(this)}).remove()},deepest:function(){return this.map(function(){var t=this;while(t.firstChild){t=t.firstChild}return t})},hoverClass:function(e){return this.hover(function(){t(this).addClass(e)},function(){t(this).removeClass(e)})},run:function(t,e,i){var r=t.apply(this,e||[]);return i||r===n?this:r},aquireId:function(e){return this.each(function(){t.aquireId(this,e)}).attr("id")},setFocus:function(){t.setFocus(this[0]);return this},scrollPos:function(t,e){if(t==n&&e==n){return{left:this.scrollLeft(),top:this.scrollTop()}}if(t&&(t.top||t.left)){e=t.top;t=t.left}t!=n&&this.scrollLeft(t);e!=n&&this.scrollTop(e);return this},toggleClasses:function(e,n,i){return this.each(function(){var r=t(this),s=arguments.length>2?i:r.hasClass(e);r.removeClass(s?e:n).addClass(s?n:e)})},whenImageReady:function(e,n){if(e){this.one("load.whenImageReady readystatechange.whenImageReady",function(n){e.call(this,n);t(this).off(".whenImageReady")})}if(!n){this.each(function(){var t=this.src;this.src="about:blank";this.src=t})}return this}});t.beget=function(e,n){var i=t.beget.F;i.prototype=e;return n?t.extend(new i,n):new i};t.beget.F=function(){};t.lang=function(e,n){if(typeof e==="boolean"){n=e;e=null}var i=t(e||"html").closest("[lang]").attr("lang")||"";return i?(n?i.substr(0,2):i).toLowerCase():null};t.fn.lang=function(e){return t.lang(this[0],e)};t.focusHere=function(i){if(i){i=t(i);if(i.attr("tabindex")==n){i.attr("tabindex",-1)}var r=t(e),s=r.scrollTop();i.trigger("focus");if(r.scrollTop()!==s){var o=t(i).offset().top-30;if(o<10){o=0}r.scrollTop(o)}}};t.fn.focusHere=function(){t.focusHere(this[0]);return this};t.fixSkiplinks=function(i){i="hashchange.fixSkipLinks";t(e).off(i).on(i,function(){var e=t(s.href.split("#"));if(e[0]){if(e.attr("tabindex")==n){e.attr("tabindex",-1)}e.trigger("focus")}})};t.throttleFn=function(t,e,n){if(typeof e==="number"){n=e;e=false}n=n||50;var i=0;return function(){var r=arguments;if(i===0){e?i++:t.apply(t,r);setTimeout(function(){i>1&&t.apply(t,r);i=0},n)}i++}};t.extend({namespace:function(e,n,r,s){var o=i,a,f=0;if(typeof e!=="string"){o=e;e=n;n=r;r=s}e=e.split(r||".");while(a=e[f++]){o=o[a]||(o[a]={})}return n?t.extend(o,n):o},reloadPage:function(t){if(!t||t===s.href){t=t||s.href;var e=!/\?/.test(t)?"?":!/[&?](?:#|$)/.test(t)?"&":"";t=t.replace(/[&?]?(#.*)?$/,e+"$1")}s.replace(t)},winWidth:function(){var t=r.documentElement;return i.innerWidth||t&&t.clientWidth||r.body.clientWidth},aquireId:function(e,i){if(typeof e==="string"){i=e;e=n}e=t(e||[])[0];if(!e||!e.id){var r=i||o+a++;if(i){var s=i.match(/\d+$/),f=s?parseInt(s[0],10):1;while(t("#"+r)[0]){if(s){i=i.replace(/\d+$/,"");s=n}r=i+f++}}if(!e){return r}if(!e.id){e.id=r}}return e.id},cssSupport:function(e,i,r,s,o,a){return function(f){if(!e){e=t("<div/>")[0];i="Khtml Ms O Moz Webkit".split(" ");s={}}o=f in s?s[f]:f in e.style||n;if(o===n){a=f.replace(/^[a-z]/,function(t){return t.toUpperCase()});r=i.length;while(r--){if(i[r]+a in e.style){o=true;break}}}return s[f]=o||false}}(),getResultBody:function(e,n){var i=t.getResultBody;n=n||{};return t("<div/>").append(t(e||[]).not(n.stripFlat||i.stripFlat||"script,title,meta,link,style").find(n.stripDeep||i.stripDeep||"script,style").remove().end())},escResultHtml:function(e,n){n=n||{};var i=n.tagName||"del",r=" "+(n.tagAttrs||'tagName="'),s=String(e).replace(/<\!DOCTYPE[^>]*>/i,"").replace(/(<\/?)(html|head|body|title|meta|style|link|script)([\s\>])/gi,function(t,e,s,o){s=s.toLowerCase();return n["keep"+s]?e+s+o:e+i+(e==="<"?r+s+'"':"")+o});s=n.keepimgSrc?s:t.imgSuppress(s,n.srcAttr);return s},imgSuppress:function(t,e){return t.replace(/(<img[^>]*? )src=/gi,"$1"+(e||"data-srcAttr")+"=")},imgUnsuppress:function(e,n){n=n||"data-srcAttr";if(typeof e==="string"){e=e.replace(new RegExp("(<img[^>]*? )"+n+"=","gi"),"$1src=")}else{e=t(e);e.find("img").add(e.filter("img")).filter("["+n+"]").each(function(){var e=t(this);e.attr("src",e.attr(n)).removeAttr(n)})}return e},scrollPos:function(e,n){return t(r).scrollPos(e,n)},setFrag:function(e,n){e=(e||"").replace(/^#/,"");var i=e&&r.getElementById(e),o=!e&&t.scrollPos();i&&(i.id="");s.href="#"+(n?e:t.encodeFrag(e));!e&&t.scrollPos(o);i&&(i.id=e)},encodeFrag:function(t){return encodeURI(t).replace(/#/g,"%23").replace(/%7C/g,"|")},getFrag:function(t,e){var n=(t||s.href).split("#")[1]||"";return e?n:decodeURIComponent(n)},setFocus:function(e){if(e){e=t(e);var n=",A,INPUT,SELECT,TEXTAREA,BUTTON,OBJECT,AREA,",i=n.indexOf(","+e[0].tagName+",")>-1&&e.is(":visible")&&e[0];if(!i&&e.is(":visible")){e.each(function(e,r){if(n.indexOf(","+r.tagName+",")>-1&&t(r).is(":visible")){i=r;return false}})}if(i){var s=t(r),o=s.scrollTop();t(i)[0].focus();if(s.scrollTop()!==o){var a=t(e).offset().top-30;if(a<10){a=0}s.scrollTop(a)}}}},toInt:function(t,e){return parseInt(t,e||10)},parseParams:function(i){i=t.trim(i!==n?i:e.location.search).replace(/^[?&]|&$/g,"");var r={};if(i){var s=i.replace(/\+/g," ").split("&"),o=decodeURIComponent,a=0,f=s.length;for(;a<f;a++){var c=s[a].split("="),u=o(c[0]);(r[u]=r[u]||[]).push(o(c[1]||""))}}return r},cropText:function(e,n,i){i=i||" ...";e=t.trim(e).replace(/\s+/g," ");if(n&&e.length>n+i.length){var r=t.cropText.re||(t.cropText.re={}),s=n+"~~"+i,o=r[s]||(r[s]=new RegExp("^(.{0,"+n+"})\\s.+$")),a=e.replace(o,"$1");return a+(a.length<e.length?i:"")}return e},inject:function(t,e){var n=[],i=e.length,r;if(t.indexOf("%{")>-1){if(isNaN(i)){for(r in e){n.push(r)}}else{while(i--){n.push(i)}}r=n.length;while(r--){var s=n[r],o=f[s]||(f[s]=new RegExp(RegExp.escape("%{"+s+"}"),"g"));t=t.replace(o,e[s])}}return t}});t.setHash=t.setFrag;t.scroll=t.scrollPos;t.fn.scroll=t.fn.scrollPos})(jQuery,document);
