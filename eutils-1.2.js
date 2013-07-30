// jQuery extra utilities 1.2  -- (c) 2010-2013 Hugsmiðjan ehf.
!function(e,t,n){var i=window,r=t,s=r.location,o={};RegExp.escape=RegExp.escape||function(e){return e.replace(/([\\\^\$*+\[\]?{}.=!:(|)])/g,"\\$1")};e.extend(e.expr[":"],{is:function(t,n,i){return e(t).is(i[3])},childof:function(t,n,i){return e(t.parentNode).is(i[3])},descof:function(t,n,i){while((t=t.parentNode)&&t!==r){if(e(t).is(i[3])){return true}}return false},target:function(e,t){return e.id&&(t=s.hash)&&t==="#"+e.id}});var a,f,u,c=function(){var t=f.css("fontSize");if(t!==u){u=t;e(window).trigger("fontresize")}};e.event.special.fontresize={setup:function(){if(this===i||this===r.body){f=e("body");u=f.css("fontSize");a=setInterval(c,500)}},teardown:function(){if(this===i||this===r.body){clearTimeout(a)}}};var l=function(t,n,i,r){var s=[],o=(r?"previous":"next")+"Sibling";t.each(function(){for(var t=this[o],r;t;t=t[o]){r=t.nodeType===1;if(i||r){if(r&&!e(t).not(n).length){break}s.push(t)}}});return t.pushStack(s)};e.fn.extend({nextUntil:function(e,t){return l(this,e,t)},prevUntil:function(e,t){return l(this,e,t,1)}});e.fn.unhide=function(){return this.css("display","")};e.fn.zap=function(){return this.each(function(){this.parentNode&&e(this.childNodes).insertBefore(this)}).remove()};e.fn.if_=function(t){if(e.isFunction(t)){t=t.call(this)}this.if_CondMet=!!t;return this.pushStack(t?this:[])};e.fn.else_=function(e){var t=this.end();return t.if_CondMet?t.pushStack([]):t.if_(arguments.length?e:1)};e.fn.extend({"null":function(){return this},fin:function(){return e(this)},shuffle:function(){var e=this,t=e.length;while(t){var n=Math.floor(t*Math.random(t--)),i=e[t];e[t]=e[n];e[n]=i}return e},imgUnsuppress:function(t){e.imgUnsuppress(this,t);return this},pause:function(t,n){return!n&&e.fn.delay?this.delay(t):this.animate({smu:0},t||t===0?t:800,n)},log:function(){if(i.console){arguments.length&&console.log.call(console,arguments);console.log(this)}return this},deepest:function(){return this.map(function(){var e=this;while(e.firstChild){e=e.firstChild}return e})},hoverClass:function(t){return this.hover(function(){e(this).addClass(t)},function(){e(this).removeClass(t)})},run:function(e,t,i){var r=e.apply(this,t||[]);return i||r===n?this:r},setFocus:function(){e.setFocus(this[0]);return this},scrollPos:function(e,t){if(e==n&&t==n){return{left:this.scrollLeft(),top:this.scrollTop()}}if(e&&(e.top||e.left)){t=e.top;e=e.left}e!=n&&this.scrollLeft(e);t!=n&&this.scrollTop(t);return this},toggleClasses:function(t,n,i){return this.each(function(){var r=e(this),s=arguments.length>2?i:r.hasClass(t);r.removeClass(s?t:n).addClass(s?n:t)})},whenImageReady:function(t,n){var i=this;if(t){i.one("load.whenImageReady readystatechange.whenImageReady",function(n){if(n.type==="load"||this.readyState==="complete"){t.call(this,n);e(this).off(".whenImageReady")}})}if(!n){setTimeout(function(){i.each(function(e,t){e=t.src;t.src="about:blank";t.src=e})},0)}return i}});e.beget=function(t,n){var i=e.beget.F;i.prototype=t;return n?e.extend(new i,n):new i};e.beget.F=function(){};e.lang=function(t,n){if(typeof t==="boolean"){n=t;t=null}var i=e(t||"html").closest("[lang]").attr("lang")||"";return i?(n?i.substr(0,2):i).toLowerCase():null};e.fn.lang=function(t){return e.lang(this[0],t)};e.focusHere=function(i){if(i){i=e(i);if(i.prop("tabindex")==n){i.prop("tabindex",-1)}var r=e(t),s=r.scrollTop();i.trigger("focus");if(r.scrollTop()!==s){var o=e(i).offset().top-30;if(o<10){o=0}r.scrollTop(o)}}};e.fn.focusHere=function(){e.focusHere(this[0]);return this};e.fixSkiplinks=function(){var i=".fixSkipLinks",r="hashchange"+i,s="click"+i;e(t).off(s).on(s,function(i){var r=i.target.href;if(!i.isDefaultPrevented()&&r){r=r.split("#");var s=r[1]&&e("#"+r[1]);if(s&&r[0]===t.location.href.split("#")[0]){if(e.focusHere){s.focusHere()}else{if(s.prop("tabindex")==n){s.prop("tabindex",-1)}s.trigger("focus")}i.preventDefault()}}})};e.aquireId=function(t,i){if(typeof t==="string"){i=t;t=n}t=e(t||[])[0];if(!t||!t.id){var r=i||e.aquireId._guidPrefix+e.aquireId._guid++;if(i){var s=i.match(/\d+$/),o=s?parseInt(s[0],10):1;while(e("#"+r)[0]){if(s){i=i.replace(/\d+$/,"");s=n}r=i+o++}}if(!t){return r}if(!t.id){t.id=r}}return t.id};e.aquireId._guidPrefix="tmp_"+(new Date).getTime()+"_",e.aquireId._guid=1,e.fn.aquireId=function(t){return this.each(function(){e.aquireId(this,t)}).attr("id")};e.throttleFn=function(e,t,n){if(typeof t==="number"){n=t;t=false}n=n||50;var i=0;return function(){var r=arguments,s=this;if(i===0){t?i++:e.apply(s,r);setTimeout(function(){i>1&&e.apply(s,r);i=0},n)}i++}};e.extend({namespace:function(t,n,r,s){var o=i,a,f=0;if(typeof t!=="string"){o=t;t=n;n=r;r=s}t=t.split(r||".");while(a=t[f++]){o=o[a]||(o[a]={})}return n?e.extend(o,n):o},reloadPage:function(e){if(!e||e===s.href){e=e||s.href;var t=!/\?/.test(e)?"?":!/[&?](?:#|$)/.test(e)?"&":"";e=e.replace(/[&?]?(#.*)?$/,t+"$1")}s.replace(e)},winWidth:function(){var e=t.documentElement;return i.innerWidth||e&&e.clientWidth||r.body.clientWidth},cssSupport:function(t,i,r,s,o,a){return function(f){if(!t){t=e("<div/>")[0];i="Khtml Ms O Moz Webkit".split(" ");s={}}o=f in s?s[f]:f in t.style||n;if(o===n){a=f.replace(/^[a-z]/,function(e){return e.toUpperCase()});r=i.length;while(r--){if(i[r]+a in t.style){o=true;break}}}o=s[f]=o||false;return o}}(),getResultBody:function(t,n){var i=e.getResultBody;n=n||{};return e("<div/>").append(e(t||[]).not(n.stripFlat||i.stripFlat||"script,title,meta,link,style").find(n.stripDeep||i.stripDeep||"script,style").remove().end())},escResultHtml:function(t,n){n=n||{};var i=n.tagName||"del",r=" "+(n.tagAttrs||'tagName="'),s=String(t).replace(/<\!DOCTYPE[^>]*>/i,"").replace(/(<\/?)(html|head|body|title|meta|style|link|script)([\s\>])/gi,function(e,t,s,o){s=s.toLowerCase();return n["keep"+s]?t+s+o:t+i+(t==="<"?r+s+'"':"")+o});s=n.keepimgSrc?s:e.imgSuppress(s,n.srcAttr);return s},imgSuppress:function(e,t){return e.replace(/(<img[^>]*? )src=/gi,"$1"+(t||"data-srcAttr")+"=")},imgUnsuppress:function(t,n){n=n||"data-srcAttr";if(typeof t==="string"){t=t.replace(new RegExp("(<img[^>]*? )"+n+"=","gi"),"$1src=")}else{t=e(t);t.find("img").add(t.filter("img")).filter("["+n+"]").each(function(){var t=e(this);t.attr("src",t.attr(n)).removeAttr(n)})}return t},scrollPos:function(t,n){return e(r).scrollPos(t,n)},setFrag:function(t,n){t=(t||"").replace(/^#/,"");var i=t&&r.getElementById(t),o=!t&&e.scrollPos();i&&(i.id="");s.href="#"+(n?t:e.encodeFrag(t));!t&&e.scrollPos(o);i&&(i.id=t)},encodeFrag:function(e){return encodeURI(e).replace(/#/g,"%23").replace(/%7C/g,"|")},getFrag:function(e,t){var n=(e||s.href).split("#")[1]||"";return t?n:decodeURIComponent(n)},setFocus:function(t){if(t){t=e(t);var n=",A,INPUT,SELECT,TEXTAREA,BUTTON,OBJECT,AREA,",i=n.indexOf(","+t[0].tagName+",")>-1&&t.is(":visible")&&t[0];if(!i&&t.is(":visible")){t.find("*").each(function(t,r){if(n.indexOf(","+r.tagName+",")>-1&&e(r).is(":visible")){i=r;return false}})}if(i){var s=e(r),o=s.scrollTop();e(i)[0].focus();if(s.scrollTop()!==o){var a=e(t).offset().top-30;if(a<10){a=0}s.scrollTop(a)}}}},toInt:function(e,t){return parseInt(e,t||10)},parseParams:function(i){i=e.trim(i!==n?i:t.location.search).replace(/^[?&]|&$/g,"");var r={};if(i){var s=i.replace(/\+/g," ").split("&"),o=decodeURIComponent,a=0,f=s.length;for(;a<f;a++){var u=s[a].split("="),c=o(u[0]);(r[c]=r[c]||[]).push(o(u[1]||""))}}return r},cropText:function(t,n,i){i=i||" ...";t=e.trim(t).replace(/\s+/g," ");if(n&&t.length>n+i.length){var r=e.cropText.re||(e.cropText.re={}),s=n+"~~"+i,o=r[s]||(r[s]=new RegExp("^(.{0,"+n+"})\\s.+$")),a=t.replace(o,"$1");return a+(a.length<t.length?i:"")}return t},inject:function(e,t){var n=[],i=t.length,r;if(e.indexOf("%{")>-1){if(isNaN(i)){for(r in t){n.push(r)}}else{while(i--){n.push(i)}}r=n.length;while(r--){var s=n[r],a=o[s]||(o[s]=new RegExp(RegExp.escape("%{"+s+"}"),"g"));e=e.replace(a,t[s])}}return e}});e.setHash=e.setFrag;e.scroll=e.scrollPos;e.fn.scroll=e.fn.scrollPos}(jQuery,document);
